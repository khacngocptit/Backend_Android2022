import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import * as uuid from "uuid";
import { ErrorData } from "../../common/exception/error-data";
import { ClientPlatform } from "../../config/constant";
import { DeviceData, DeviceDataDocument } from "../device-data/entities/device-data.entity";
import { OneSignalClient } from "../one-signal/one-signal";
import { ONE_SIGNAL_CLIENT } from "../one-signal/one-signal-client";
import { DB_DEVICE_DATA, DB_USER } from "../repository/db-collection";
import { UserAuthorizedDocument } from "../user/dto/user-authorized.dto";
import { User, UserDocument } from "../user/entities/user.entity";
import { AuthErrorCode } from "./common/auth.constant";
import { JwtPayload } from "./dto/jwt-payload";
import { LoginMobileRequestDto } from "./dto/login-mobile-request.dto";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResultDto } from "./dto/login-result.dto";
import * as bcrypt from "bcryptjs";
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,
        @Inject(ONE_SIGNAL_CLIENT)
        private readonly oneSignalClient: OneSignalClient,

        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userModel.findOne({ username: username.toLowerCase() });
        if (user) {
            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                return user;
            }
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD);
        } else {
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND);
        }
    }

    async loginWeb(user: LoginRequestDto): Promise<User> {
        const u = await this.userModel.findOne({ username: user.username });
        const isMatch = await bcrypt.compare(user.password, u.password);
        if (isMatch) {
            return u;
        }
        return null;
    }

    async loginMobile(user: UserDocument, loginInfo: LoginMobileRequestDto) {
        const jti = uuid.v4();
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                platform: ClientPlatform.MOBILE,
                deviceId: loginInfo.deviceId,
            },
            jti,
        };
        if (loginInfo.oneSignalId !== undefined) {
            this.oneSignalClient
                .viewDevice(loginInfo.oneSignalId)
                .catch((err) => err)
                .then((oneSignalRes) => {
                    if (oneSignalRes.statusCode === 200) {
                        this.deviceDataModel
                            .findOneAndUpdate(
                                { oneSignalId: loginInfo.oneSignalId },
                                {
                                    $set: {
                                        username: user.username,
                                        deviceId: loginInfo.deviceId,
                                        jti,
                                    } as DeviceData,
                                },
                                { new: true, upsert: true },
                            )
                            .exec();
                    }
                });
        }
        return user;
    }

    async logoutMobile(user: UserAuthorizedDocument): Promise<void> {
        this.deviceDataModel.deleteOne({ jti: user.jti }).exec();
    }
}
