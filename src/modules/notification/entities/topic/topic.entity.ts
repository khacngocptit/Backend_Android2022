import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_TOPIC } from "../../../repository/db-collection";
import { TopicType } from "../../common/notification.constant";

@Schema({
    collection: DB_TOPIC,
    // discriminatorKey: "type",
})
export class Topic {
    @Prop({ type: String })
    _id: string;

    @IsString()
    @Prop({ required: true })
    name: string;

    @IsEnum(TopicType)
    @Prop({ type: String, enum: Object.values(TopicType) })
    type?: TopicType;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
export type TopicDocument = Topic & Document;
