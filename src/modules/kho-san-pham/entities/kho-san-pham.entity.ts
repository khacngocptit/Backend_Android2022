import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_KHO_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsNumber, IsString } from "class-validator";

@Schema({
    collection: DB_KHO_SAN_PHAM,
    timestamps: true,
})

export class KhoSanPham {
    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    productId: string;

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    storeId: string;

    @Prop()
    @IsNumber()
    quality: number;
}

export const KhoSanPhamSchema = SchemaFactory.createForClass(KhoSanPham);
export type KhoSanPhamDocument = mongoose.Document & KhoSanPham;