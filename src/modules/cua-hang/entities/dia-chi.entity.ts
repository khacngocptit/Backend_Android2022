import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
@Schema({
    _id: false,
})
export class DiaChi {
    @Prop()
    tenTinh: string;

    @Prop()
    tenQuanHuyen: string;

    @Prop()
    tenPhuongXa: string;

    @Prop()
    soNhaTenDuong: string;
}

export const DiaChiSchema = SchemaFactory.createForClass(DiaChi);
