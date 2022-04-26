import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DB_LICH_SU_KHO_HANG, DB_SAN_PHAM } from "src/modules/repository/db-collection";
import * as mongoose from "mongoose";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { stringList } from "aws-sdk/clients/datapipeline";

@Schema({
    collection: DB_LICH_SU_KHO_HANG,
    timestamps: true,
})

export class LichSuKhoHang {
    @IsString()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_SAN_PHAM })
    productId: string;

    @IsNumber()
    @Prop({ required: true })
    quality: string;

    @IsNumber()
    @Prop({ required: true })
    price: number;

    @IsString()
    @Prop()
    storeId: string;

    @IsDateString()
    @Prop()
    date: string;

    @IsNumber()
    @IsOptional()
    @Prop()
    discount: number;

    @IsBoolean()
    @Prop()
    isExport: boolean;
}

export const LichSuKhoHangSchema = SchemaFactory.createForClass(LichSuKhoHang);
export type LichSuKhoHangDocument = mongoose.Document & LichSuKhoHang;