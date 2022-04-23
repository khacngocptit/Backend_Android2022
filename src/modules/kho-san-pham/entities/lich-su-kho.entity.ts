import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_LICH_SU_KHO_HANG } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";

@Schema({
    collection: DB_LICH_SU_KHO_HANG,
    timestamps: true,
})

export class LichSuKhoHang {

}

export const LichSuKhoHangSchema = SchemaFactory.createForClass(LichSuKhoHang);
export type LichSuKhoHangDocument = mongoose.Document & LichSuKhoHang;