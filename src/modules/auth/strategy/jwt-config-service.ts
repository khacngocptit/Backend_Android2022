import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createJwtOptions(): JwtModuleOptions {
        const expiresIn = this.configService.get("jwt.exp");
        const signOptions = { ...(expiresIn !== undefined && { expiresIn }) };
        return {
            secret: this.configService.get("jwt.secret"),
            signOptions,
        };
    }
}
