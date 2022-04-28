import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorDataDto } from "src/common/dto/error-data.dto";
import { CuaHangDocument } from "../cua-hang/entities/cua-hang.entity";
import { DB_CUA_HANG, DB_KHO_SAN_PHAM, DB_LICH_SU_KHO_HANG } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { NhapKhoDto } from "./dto/nhap-kho.dto";
import { PhanKhoDto } from "./dto/phan-kho.dto";
import { KhoSanPham, KhoSanPhamDocument } from "./entities/kho-san-pham.entity";
import { LichSuKhoHangDocument } from "./entities/lich-su-kho.entity";

@Injectable()
export class KhoSanPhamService extends MongoRepository<KhoSanPhamDocument>{
    constructor(
        @InjectModel(DB_KHO_SAN_PHAM)
        private readonly khoSanPhamModel: Model<KhoSanPhamDocument>,
        @InjectModel(DB_LICH_SU_KHO_HANG)
        private readonly lichSuKhoHangModel: Model<LichSuKhoHangDocument>,
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>
    ) {
        super(khoSanPhamModel);
    }

    async nhapKho(
        body: NhapKhoDto
    ) {
        const data = new this.lichSuKhoHangModel(body);
        data.isExport = false;
        const nhapKho = await data.save();
        const isRoot = await this.cuaHangModel.exists({ isRoot: true, _id: nhapKho.storeId });
        if (!isRoot) {
            throw ErrorDataDto.BadRequest("NOT_ROOT");
        }
        await this.khoSanPhamModel.findOneAndUpdate(
            {
                productId: nhapKho.productId,
                storeId: nhapKho.storeId,
            },
            {
                $inc: {
                    quality: nhapKho.quality,
                },
                $set: {
                    productId: nhapKho.productId,
                    storeId: nhapKho.storeId,
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return nhapKho;
    }

    async phanKhoCuaHang(
        storeId: string,
        phanKho: PhanKhoDto
    ) {
        const isRoot = await this.cuaHangModel.findOne({ isRoot: true, _id: storeId });
        if (!isRoot) {
            throw ErrorDataDto.BadRequest("NOT_STORE_ROOT");
        }
        const xuatKhoTong = await this.khoSanPhamModel.findOneAndUpdate({
            storeId: storeId,
            productId: phanKho.productId,
        }, {
            $inc: {
                quality: -phanKho.quality,
            },
        }, { new: true });
        if (!xuatKhoTong) {
            throw ErrorDataDto.BadRequest("Không đủ số lượng sản phẩm trong kho");
        }
        const nhapKhoCon = await this.khoSanPhamModel.findOneAndUpdate(
            {
                storeId: phanKho.storeId,
                productId: phanKho.productId,
            },
            {
                $inc: {
                    quality: phanKho.quality,
                },
                $set: {
                    storeId: phanKho.storeId,
                    productId: phanKho.productId,
                },
            },
            {
                new: true,
                upsert: true,
            }
        );
        return nhapKhoCon;
    }

    async xuatKho(
        body: NhapKhoDto
    ) {
        const xuatKho = new this.lichSuKhoHangModel(body);
        xuatKho.isExport = true;
        xuatKho.save();
        const khoSanPham = await this.khoSanPhamModel.findOneAndUpdate(
            {
                productId: xuatKho.productId,
                storeId: xuatKho.storeId,
                quality: { $gte: xuatKho.quality },
            },
            {
                $inc: {
                    quality: -xuatKho.quality,
                },
            },
            {
                new: true,
            }
        );
        if (!khoSanPham) {
            throw ErrorDataDto.BadRequest("Không đủ sản phẩm trong kho");
        }
        return khoSanPham;
    }
}
