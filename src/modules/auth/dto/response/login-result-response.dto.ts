import { User } from "src/modules/user/entities/user.entity";
import { ResponseDto } from "../../../../common/dto/response/response.dto";
import { LoginResultDto } from "../login-result.dto";

export class LoginResultResponseDto extends ResponseDto<User> {
    data: User;
}
