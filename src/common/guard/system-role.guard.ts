import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { getExtendedSystemRoles, SystemRole } from "../../modules/user/common/user.constant";
import { User } from "../../modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const systemRoles =
            this.reflector.get<SystemRole[]>("system-roles", context.getHandler()) ||
            this.reflector.get<SystemRole[]>("system-roles", context.getClass());

        if (systemRoles === undefined) {
            return true;
        }

        const user = context.switchToHttp().getRequest<Request>().user as User;
        const extendedSystemRoles = getExtendedSystemRoles(user.systemRole).filter((extendedRole) =>
            systemRoles.includes(extendedRole),
        );
        if (extendedSystemRoles.length > 0) {
            return true;
        }
        return false;
    }
}
