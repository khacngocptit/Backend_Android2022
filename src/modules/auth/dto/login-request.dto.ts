import { IsString } from "class-validator";

export class LoginRequestDto {
    /**
     * Username
     * @example username
     */
    @IsString()
    username: string;

    /**
     * Password
     * @example password
     */
    @IsString()
    password: string;
}
