import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";

@Schema({
    collection: DB_SAN_PHAM,
})

export class SanPham {

}

export const SanPhamSchema = SchemaFactory.createForClass(SanPham);
export type SanPhamDocument = mongoose.Document & SanPham;