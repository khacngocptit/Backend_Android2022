import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AuthErrorCode } from "../../modules/auth/common/auth.constant";
import { SettingKey } from "../../modules/setting/common/setting.constant";
import { SettingService } from "../../modules/setting/service/setting.service";
import { ErrorData } from "../exception/error-data";

@Injectable()
export class WorkspaceIpAddressGuard implements CanActivate {
    constructor(private readonly settingService: SettingService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const clientIpAddress = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress);
        const workspaceIpAddress = await this.settingService.getSettingValue<string>(SettingKey.WORKSPACE_IP_ADDRESS);
        if (clientIpAddress.endsWith(workspaceIpAddress)) {
            return true;
        } else {
            throw ErrorData.Unauthorized(AuthErrorCode.UNAUTHORIZED_WRONG_WORKSPACE_IP_ADDRESS);
        }
    }
}
