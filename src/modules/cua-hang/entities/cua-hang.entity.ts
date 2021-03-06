import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_USER } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsOptional, IsString, ValidateNested } from "class-validator";

@Schema({
    collection: DB_CUA_HANG,
})
export class CuaHang {
    @IsString()
    @Prop()
    name: string;

    @Prop()
    imageUrl: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    description?: string;

    @Prop()
    isRoot: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER })
    userId: string;
}
export const CuaHangSchema = SchemaFactory.createForClass(CuaHang);

export type CuaHangDocument = mongoose.Document & CuaHang;
