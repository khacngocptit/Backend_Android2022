import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_DANH_MUC_SAN_PHAM, DB_KHO_SAN_PHAM, DB_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsNumber, IsOptional, IsString } from "class-validator";

@Schema({
    collection: DB_SAN_PHAM,
})

export class SanPham {

    @IsString()
    @Prop()
    name: string;

    @Prop()
    codeProduct: string;

    @IsString()
    @Prop()
    images: string;

    @IsString()
    @IsOptional()
    @Prop()
    description?: string;

    @Prop()
    price: number;

    @Prop()
    isHot: boolean;

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_CUA_HANG })
    userId: string;

    @IsNumber()
    @IsOptional()
    @Prop()
    quantity: number;
}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
export type SanPhamDocument = mongoose.Document & SanPham;