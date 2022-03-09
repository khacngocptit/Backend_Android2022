import { PickType } from "@nestjs/swagger";
import { CreateProfileDto } from "../../profile/dto/create-profile.dto";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PickType(User, ["username", "password", "email", "systemRole"]) {
    profile: CreateProfileDto;
}
