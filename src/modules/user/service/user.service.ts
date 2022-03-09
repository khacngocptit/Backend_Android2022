import { AccessibleModel } from "@casl/mongoose";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { DocumentQuery, mongo } from "mongoose";
import { PageableDto } from "../../../common/dto/pageable.dto";
import { ErrorData } from "../../../common/exception/error-data";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { JwtPayload } from "../../auth/dto/jwt-payload";
import { LoginResultDto } from "../../auth/dto/login-result.dto";
import { Gender } from "../../profile/common/profile.constant";
import { DB_USER } from "../../repository/db-collection";
import { UserAbilityFactory } from "../common/user.ability";
import { SystemRole, UserErrorCode } from "../common/user.constant";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserAuthorizedDocument } from "../dto/user-authorized.dto";
import { UserPageableDto } from "../dto/user-pageable.dto";
import { User, UserDocument } from "../entities/user.entity";
@Injectable()
export class UserService implements OnModuleInit {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(DB_USER)
        private readonly userModel: AccessibleModel<UserDocument>,

        private readonly userAbilityFactory: UserAbilityFactory,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        await this.initAdmin();
    }

    async initAdmin() {
        const exists = await this.userModel.exists({ username: "admin" });
        if (!exists) {
            this.logger.verbose("Initializing Administrator");
            await this.userModel.create({
                username: "admin",
                password: this.configService.get<string>("project.defaultAdminPassword"),
                systemRole: SystemRole.ADMIN,
                email: "administrator@project.com",
                profile: {
                    firstname: "Admin",
                    lastname: "Manager",
                    dateOfBirth: new Date(),
                    gender: Gender.MALE,
                },
            } as User);
        } else {
            this.logger.verbose("Administrator initialized");
        }
    }

    create(createUserDto: CreateUserDto) {
        return this.userModel.create(createUserDto);
    }

    findById(id: string): DocumentQuery<UserDocument, UserDocument> {
        return this.userModel.findById(id);
    }

    async findPageable(conditions: any, option: FetchQueryOption): Promise<UserPageableDto> {
        const total = this.userModel.countDocuments(conditions);
        const result = this.userModel
            .find(conditions)
            .setOptions(option)
            .select("-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo");
        return Promise.all([total, result]).then((p) => PageableDto.create(option, p[0], p[1]));
    }

    userFindAll(user: UserDocument) {
        return this.userModel
            .accessibleBy(this.userAbilityFactory.createForUser(user), "read")
            .find()
            .select("-authorizationVersion -passwordReset -emailVerify -password -identifiedDeviceInfo");
    }

    userFindById(user: UserDocument, id: string) {
        return this.userModel.accessibleBy(this.userAbilityFactory.createForUser(user), "read").findOne({ _id: id });
    }

    async userUpdateById(user: UserDocument, id: string, updateUserDto: UpdateUserDto) {
        const updateUser = await this.userModel
            .accessibleBy(this.userAbilityFactory.createForUser(user), "update")
            .findOne({ _id: id });
        if (updateUser) {
            Object.assign(updateUser, updateUserDto);
            return updateUser.save();
        }
        return null;
    }

    userDeleteById(user: UserDocument, id: string) {
        return this.userModel.accessibleBy(this.userAbilityFactory.createForUser(user), "delete").findOneAndRemove({ _id: id });
    }

    async changePassword(user: UserAuthorizedDocument, changePassword: ChangePasswordDto): Promise<LoginResultDto> {
        const correctOldPassword = await user.comparePassword(changePassword.oldPassword);
        if (!correctOldPassword) {
            throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_WRONG_OLD_PASSWORD);
        }
        if (changePassword.newPassword === changePassword.oldPassword) {
            throw ErrorData.BadRequest(UserErrorCode.BAD_REQUEST_DUPLICATE_NEW_PASSWORD);
        }
        user.password = changePassword.newPassword;
        await user.save();
        user.password = undefined;
        const payload: JwtPayload = {
            sub: {
                userId: user._id,
                authorizationVersion: user.authorizationVersion.version + 1,
                platform: user.clientPlatform,
            },
            jti: new mongo.ObjectId().toHexString(),
        };
        return { user, accessToken: this.jwtService.sign(payload) };
    }

    async testRemove(user: UserDocument) {
        return this.userModel.updateOne({ _id: user._id }, { $unset: { identifiedDeviceInfo: 1 } });
    }
}
