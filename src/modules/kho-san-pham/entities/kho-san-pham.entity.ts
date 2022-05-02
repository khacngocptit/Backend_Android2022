import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_CUA_HANG, DB_KHO_SAN_PHAM, DB_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsNumber, IsString } from "class-validator";

@Schema({
    collection: DB_KHO_SAN_PHAM,
    timestamps: true,
})

export class KhoSanPham {
    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_SAN_PHAM })
    productId: string;

    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_SAN_PHAM })
    storeId: string;

    @Prop()
    @IsNumber()
    quantity: number;
}

export const KhoSanPhamSchema = SchemaFactory.createForClass(KhoSanPham);
export type KhoSanPhamDocument = mongoose.Document & KhoSanPham;