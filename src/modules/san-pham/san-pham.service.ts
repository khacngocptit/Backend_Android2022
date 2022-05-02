import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CuaHangDocument } from "../cua-hang/entities/cua-hang.entity";
import { KhoSanPham } from "../kho-san-pham/entities/kho-san-pham.entity";
import { KhoSanPhamService } from "../kho-san-pham/kho-san-pham.service";
import { DB_CUA_HANG, DB_SAN_PHAM } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { CreateSanPham } from "./dto/create-san-pham.dto";
import { SanPhamDocument } from "./entities/san-pham.entity";

@Injectable()
export class SanPhamService extends MongoRepository<SanPhamDocument>{
    constructor(
        @InjectModel(DB_SAN_PHAM)
        private readonly sanPhamModel: Model<SanPhamDocument>,
        private readonly khoSanPhamService: KhoSanPhamService,
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>
    ) {
        super(sanPhamModel);
    }

    async createSanPham(body: CreateSanPham) {
        const { quality, ...sanPham } = body;
        const userId = await this.cuaHangModel.findById({ _id: body.storeId });
        const rootId = await this.cuaHangModel.findOne({ userId: userId.userId, isRoot: true });
        const sanPhamDoc = await this.create(sanPham);
        const dataChuyenNhuong = {
            storeId: sanPhamDoc.storeId,
            productId: sanPhamDoc._id,
            quality,
        } as KhoSanPham;
        await this.khoSanPhamService.phanKhoCuaHang(rootId._id, dataChuyenNhuong);
        return sanPhamDoc;
    }
}
