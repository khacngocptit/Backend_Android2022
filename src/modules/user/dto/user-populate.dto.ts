import { User, UserDocument } from "../entities/user.entity";

export class UserPopulateDto extends User {}

export type UserPopulateDocument = UserPopulateDto & UserDocument;
