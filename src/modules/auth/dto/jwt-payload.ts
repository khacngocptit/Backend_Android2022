export class JwtPayload {
    sub: {
        userId: string;
        platform?: string;
        deviceId?: string;
    };
    jti: string;
}
