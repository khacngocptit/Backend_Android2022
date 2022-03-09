import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsOptional, IsString } from "class-validator";
import * as mongoose from "mongoose";
import { v4 } from "uuid";
import { DB_NOTIFICATION, DB_TOPIC } from "../../repository/db-collection";
import { SystemRole } from "../../user/common/user.constant";
import { NotificationType } from "../common/notification.constant";

@Schema({ collection: DB_NOTIFICATION, timestamps: true })
export class Notification {
    @Prop({ default: () => v4() })
    _id?: string;

    @IsString()
    @Prop({ required: true })
    title: string;

    @IsString()
    @Prop({ required: true })
    senderName: string;

    @IsString()
    @Prop()
    @IsOptional()
    senderId?: string;

    @IsString()
    @Prop()
    @IsOptional()
    description: string;

    @IsString()
    @Prop({ required: true })
    content?: string;

    @IsString()
    @Prop({ required: true })
    htmlContent?: string;

    @IsString()
    @Prop()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @Prop({ ref: DB_TOPIC })
    @IsOptional()
    topicId?: string;

    @Prop({ type: String, enum: Object.values(NotificationType), required: true })
    notifType: NotificationType;

    @IsString({ each: true })
    @IsOptional()
    @Prop([String])
    userIds?: string[];

    @IsEnum(SystemRole, { each: true })
    @IsOptional()
    @Prop([{ type: String, enum: Object.values(SystemRole) }])
    roles?: SystemRole[];

    @Prop({ type: mongoose.Schema.Types.Mixed })
    info?: any;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    oneSignalData?: any;

    createdAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = Notification & mongoose.Document;
