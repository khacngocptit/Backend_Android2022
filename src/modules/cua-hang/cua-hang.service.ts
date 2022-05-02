import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KhoSanPhamDocument } from "../kho-san-pham/entities/kho-san-pham.entity";
import { DB_CUA_HANG, DB_KHO_SAN_PHAM, DB_SAN_PHAM } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { SanPhamDocument } from "../san-pham/entities/san-pham.entity";
import { CuaHangDocument } from "./entities/cua-hang.entity";
import * as bluebird from "bluebird";
import e from "express";
import { ErrorData } from "src/common/exception/error-data";
import { ErrorDataDto } from "src/common/dto/error-data.dto";

@Injectable()
export class CuaHangService extends MongoRepository<CuaHangDocument> {
    constructor(
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>,

        @InjectModel(DB_KHO_SAN_PHAM)
        private readonly khoSanPhamModel: Model<KhoSanPhamDocument>,

        @InjectModel(DB_SAN_PHAM)
        private readonly sanPhamModel: Model<SanPhamDocument>
    ) {
        super(cuaHangModel);
    }
    async deleteCuaHang(id: string) {
        const data = await this.cuaHangModel.findOneAndDelete({ _id: id });
        if (data.isRoot) {
            throw ErrorDataDto.BadRequest("KHONG_THE_XOA_CUA_HANG_ROOT");
        } else {
            const cuaHangCha = await this.cuaHangModel.findOne({ isRoot: true, userId: data.userId })
            const sanPhamTrongKhoHang = await this.khoSanPhamModel.find({ storeId: id });
            await bluebird.map(sanPhamTrongKhoHang, async el => {
                const sl = await this.khoSanPhamModel.findOneAndDelete({ productId: el.productId, storeId: el.storeId });
                await this.khoSanPhamModel.findOneAndUpdate({
                    productId: el.productId, storeId: cuaHangCha._id,
                }, {
                    $inc: {
                        quantity: sl.quantity,
                    }
                })
            })
        }
        return data;
    }
}
