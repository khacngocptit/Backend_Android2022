import { IsOptional } from "class-validator";

export class NotificationCondition {
    @IsOptional()
    "title": any;

    @IsOptional()
    "senderName": any;

    @IsOptional()
    "notifType": any;

    @IsOptional()
    "info": any;

    @IsOptional()
    "info.idLopHanhChinh": any;

    @IsOptional()
    "info.idLopTinChi": any;

    @IsOptional()
    "createdAt": any;
}
