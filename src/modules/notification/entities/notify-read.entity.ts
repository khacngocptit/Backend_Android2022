import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import * as mongoose from "mongoose";
import { DB_NOTIFICATION, DB_NOTIFY_READ } from "../../repository/db-collection";
import { NotifyReadType } from "../common/notification.constant";

@Schema({ collection: DB_NOTIFY_READ })
export class NotifyRead {
    @Prop({ required: true })
    userId: string;

    @IsString()
    @Prop({ ref: DB_NOTIFICATION })
    notificationId?: string;

    @Prop({ required: true, type: String, enum: Object.values(NotifyReadType) })
    type: NotifyRead;

    @Prop({ default: () => new Date() })
    readAt?: Date;
}

export const NotifyReadSchema = SchemaFactory.createForClass(NotifyRead);
export type NotifyReadDocument = NotifyRead & mongoose.Document;
