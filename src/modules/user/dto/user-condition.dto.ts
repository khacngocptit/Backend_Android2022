import { IsOptional } from "class-validator";

export class UserCondition {
    @IsOptional()
    email: any;
}
