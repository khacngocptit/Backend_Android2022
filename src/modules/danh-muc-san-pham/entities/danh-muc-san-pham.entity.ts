import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_DANH_MUC_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsOptional } from "class-validator";

@Schema({
    collection: DB_DANH_MUC_SAN_PHAM,
})

export class DanhMucSanPham {
    @Prop()
    name: string;

    @Prop()
    @IsOptional()
    description?: string;
}

export const DanhMucSanPhamSchema = SchemaFactory.createForClass(DanhMucSanPham);

export type DanhMucSanPhamDocument = mongoose.Document & DanhMucSanPham;