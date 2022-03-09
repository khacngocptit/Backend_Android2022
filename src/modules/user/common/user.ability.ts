import { Ability, defineAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../../../common/types";
import { DB_USER } from "../../repository/db-collection";
import { UserDocument } from "../entities/user.entity";
import { SystemRole } from "./user.constant";

@Injectable()
export class UserAbilityFactory {
    createForUser(user: UserDocument) {
        return defineAbility<Ability<[Action, any]>>((can, cannot) => {
            if (user.hasSystemRole(SystemRole.ADMIN)) {
                can("manage", DB_USER);
            } else if (user.hasSystemRole(SystemRole.USER)) {
                can("read", DB_USER, { _id: user._id });
                can("update", DB_USER, { _id: user._id });
            }
        });
    }
}
