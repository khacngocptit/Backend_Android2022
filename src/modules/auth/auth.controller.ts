import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApiUnauthorizedDoc } from "../../common/decorator/api.decorator";
import { Authorization } from "../../common/decorator/auth.decorator";
import { ReqUser } from "../../common/decorator/user.decorator";
import { ResponseDto } from "../../common/dto/response/response.dto";
import { UserAuthorizedDocument } from "../user/dto/user-authorized.dto";
import { UserDocument } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { AuthErrorCode } from "./common/auth.constant";
import { LoginMobileRequestDto } from "./dto/login-mobile-request.dto";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResultResponseDto } from "./dto/response/login-result-response.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginRequestDto })
    @Post("login/web")
    @ApiUnauthorizedDoc(
        { errorCode: AuthErrorCode.UNAUTHORIZED_USERNAME_NOT_FOUND, errorDescription: "Không tìm thấy username" },
        { errorCode: AuthErrorCode.UNAUTHORIZED_WRONG_PASSWORD, errorDescription: "Sai mật khẩu" },
    )
    async loginWeb(@Body() user: LoginRequestDto): Promise<LoginResultResponseDto> {
        const data = await this.authService.loginWeb(user);
        return ResponseDto.create(data);
    }

}
