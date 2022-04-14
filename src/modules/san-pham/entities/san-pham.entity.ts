import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";

@Schema({
    collection: DB_SAN_PHAM,
})

export class SanPham {

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_CUA_HANG })
    cuaHangId: string;

    @IsString()
    @Prop()
    tenSanPham: string;

    @Prop()
    maSanPham: string;

    @IsString({ each: true })
    @Prop(raw([String]))
    anhSanPham: string[];

    @IsString()
    @IsOptional()
    @Prop()
    moTa?: string;

    @IsNumber()
    @Prop()
    soLuongSanPham: string;

    @IsNumber()
    @Prop()
    giaTien: string;
}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
export type SanPhamDocument = mongoose.Document & SanPham;