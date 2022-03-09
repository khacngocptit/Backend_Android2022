import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";
import * as mongoose from "mongoose";
import { DB_JOIN_TOPIC, DB_TOPIC } from "../../repository/db-collection";

@Schema({ collection: DB_JOIN_TOPIC })
export class JoinTopic {
    @IsString()
    @Prop({ required: true, ref: DB_TOPIC })
    topicId: string;

    @IsString()
    @Prop({ required: true })
    participantId: string;

    @IsDateString()
    @Prop({ required: true })
    joinedAt: Date;

    @IsDateString()
    @Prop()
    @IsOptional()
    readAllNotifAt?: Date;

    @IsDateString()
    @Prop()
    leftAt?: Date;

    @IsBoolean()
    @IsOptional()
    @Prop({ default: () => true })
    turnOnNofif?: boolean;
}

export const JoinTopicSchema = SchemaFactory.createForClass(JoinTopic);
export type JoinTopicDocument = JoinTopic & mongoose.Document;
