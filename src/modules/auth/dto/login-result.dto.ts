import { UserAuthorizedDto } from "../../user/dto/user-authorized.dto";

export class LoginResultDto {
    user: UserAuthorizedDto;
    accessToken: string;
}
