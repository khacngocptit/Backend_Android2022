import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_USER } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsString, ValidateNested } from "class-validator";
import { DiaChi, DiaChiSchema } from "./dia-chi.entity";
import { Type } from "class-transformer";

@Schema({
    collection: DB_CUA_HANG,
})
export class CuaHang {
    @IsString()
    @Prop()
    tenCuaHang: string;

    @IsString()
    @Prop()
    maCuaHang: string;

    @ValidateNested()
    @Type(() => DiaChi)
    @Prop(raw(DiaChiSchema))
    diaChi: DiaChi;

    @Prop()
    moTa?: string;
}
export const CuaHangSchema = SchemaFactory.createForClass(CuaHang);

export type CuaHangDocument = mongoose.Document & CuaHang;
