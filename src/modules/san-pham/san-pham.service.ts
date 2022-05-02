import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CuaHangDocument } from "../cua-hang/entities/cua-hang.entity";
import { KhoSanPham, KhoSanPhamDocument } from "../kho-san-pham/entities/kho-san-pham.entity";
import { KhoSanPhamService } from "../kho-san-pham/kho-san-pham.service";
import { DB_CUA_HANG, DB_KHO_SAN_PHAM, DB_SAN_PHAM } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { CreateSanPham } from "./dto/create-san-pham.dto";
import { SanPham, SanPhamDocument } from "./entities/san-pham.entity";
import * as Bluebird from "bluebird";

@Injectable()
export class SanPhamService extends MongoRepository<SanPhamDocument>{
    constructor(
        @InjectModel(DB_SAN_PHAM)
        private readonly sanPhamModel: Model<SanPhamDocument>,
        private readonly khoSanPhamService: KhoSanPhamService,
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>,
        @InjectModel(DB_KHO_SAN_PHAM)
        private readonly khoSanPhamModel: Model<KhoSanPhamDocument>
    ) {
        super(sanPhamModel);
    }

    async createSanPham(body: CreateSanPham) {
        const { quantity, ...sanPham } = body;
        const sanPhamDoc = await this.create(sanPham);
        const store = await this.cuaHangModel.findOne({ isRoot: true, userId: sanPham.userId });
        const kho = {
            storeId: store._id,
            productId: sanPhamDoc._id,
            quantity,
        } as KhoSanPham;
        await this.khoSanPhamModel.create(kho);
        return sanPhamDoc;
    }

    async updateSanPham(id: string, body: CreateSanPham) {
        const { quantity, ...sanPham } = body;
        const sanPhamDoc = await this.sanPhamModel.findByIdAndUpdate(id, { $set: sanPham }, { new: true });
        const store = await this.cuaHangModel.findOne({ isRoot: true, userId: sanPham.userId });
        const kho = {
            storeId: store._id,
            productId: sanPhamDoc._id,
            quantity,
        } as KhoSanPham;
        await this.khoSanPhamModel.findOneAndUpdate({
            storeId: kho.storeId,
            productId: kho.productId,
        }, { $set: kho }, { new: true });
        return sanPhamDoc;
    }

    async deleteSanPham(id: string) {
        const data = await this.deleteById(id);
        await this.khoSanPhamModel.deleteMany({ productId: data._id });
        return data;
    }

    async getSanPham(condition: any) {
        const data = await this.sanPhamModel.find(condition).populate("_id");
        return data;
    }

    async getSanPhamTheoUser(userId: string) {
        const data = await this.cuaHangModel.findOne({ isRoot: true, userId });
        return this.getSanPhamTheoCuaHang(data._id);
    }

    async getSanPhamTheoCuaHang(id: string) {
        const kho = await this.khoSanPhamModel.find({ storeId: id }).populate("productId").lean();
        const result = kho.map(el => {
            return {
                ...el.productId,
                quantity: el.quantity,
            } as SanPham;
        });
        return result;
    }
}
