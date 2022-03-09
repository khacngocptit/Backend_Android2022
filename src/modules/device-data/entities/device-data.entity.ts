import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_DEVICE_DATA } from "../../repository/db-collection";

@Schema({
    timestamps: true,
    collection: DB_DEVICE_DATA,
})
export class DeviceData {
    @IsString()
    @Prop({ required: true })
    username: string;

    @IsString()
    @Prop({ required: true, unique: true })
    oneSignalId: string;

    @IsString()
    @Prop({ required: true })
    deviceId: string;

    @IsString()
    @Prop({ required: true })
    jti: string;
}

export const DeviceDataSchema = SchemaFactory.createForClass(DeviceData);
export type DeviceDataDocument = DeviceData & Document;
