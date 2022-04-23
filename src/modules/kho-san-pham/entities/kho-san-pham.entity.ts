import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_KHO_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";

@Schema({
    collection: DB_KHO_SAN_PHAM,
    timestamps: true,
})

export class KhoSanPham {

}

export const KhoSanPhamSchema = SchemaFactory.createForClass(KhoSanPham);
export type KhoSanPhamDocument = mongoose.Document & KhoSanPham;