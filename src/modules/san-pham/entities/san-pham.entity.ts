import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_SAN_PHAM } from "src/modules/repository/db-collection";
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
    discount: number;

    @Prop()
    isHot: boolean;

    @IsString({ each: true })
    @Prop(raw([String]))
    listCategoryId: string[];

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    storeId: string;
}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
export type SanPhamDocument = mongoose.Document & SanPham;