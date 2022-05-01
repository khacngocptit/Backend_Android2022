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
import * as bluebird from "bluebird";
import moment from "moment";

@Injectable()
export class KhoSanPhamService extends MongoRepository<KhoSanPhamDocument>{
    constructor(
        @InjectModel(DB_KHO_SAN_PHAM)
        private readonly khoSanPhamModel: Model<KhoSanPhamDocument>,
        @InjectModel(DB_LICH_SU_KHO_HANG)
        private readonly lichSuKhoHangModel: Model<LichSuKhoHangDocument>,
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>,
    ) {
        super(khoSanPhamModel);
    }

    async nhapKho(
        body: NhapKhoDto
    ) {
        const data = new this.lichSuKhoHangModel(body);
        data.isExport = false;
        data.day = moment(data.date).date();
        data.month = moment(data.date).month();
        data.year = moment(data.date).year();
        const { quality, ...update } = data;
        const nhapKho = await this.lichSuKhoHangModel.findOneAndUpdate(
            {
                isExport: false,
                storeId: data.storeId,
                day: moment(data.date).date(),
                month: moment(data.date).month(),
                year: moment(data.date).year(),
                productId: data.productId,
            },
            {
                $inc: {
                    quality: quality,
                },
                $set: update,
            },
            {
                upsert: true,
            }
        );
        const isRoot = await this.cuaHangModel.exists({ isRoot: true, _id: nhapKho.storeId });
        if (!isRoot) {
            throw ErrorDataDto.BadRequest("NOT_ROOT");
        }
        const kho = await this.khoSanPhamModel.findOneAndUpdate(
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
        return kho;
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
        xuatKho.day = moment(body.date).date();
        xuatKho.month = moment(body.date).month();
        xuatKho.year = moment(body.date).year();
        const { quality, ...update } = xuatKho;
        await this.lichSuKhoHangModel.findOneAndUpdate(
            {
                isExport: true,
                storeId: body.storeId,
                day: moment(body.date).date(),
                month: moment(body.date).month(),
                year: moment(body.date).year(),
                productId: body.productId,
            },
            {
                $inc: {
                    quality,
                },
                $set: update,
            },
            {
                upsert: true,
            }
        );
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

    async doanhThu(userId: string, thang: number, nam: number) {
        const listStore = await this.cuaHangModel.find({ userId });
        const listStoreId = listStore.map(el => el._id.toString());
        const doanhThu = await this.lichSuKhoHangModel.aggregate([
            {
                $match: {
                    storeId: { $in: listStoreId },
                    year: nam,
                    month: thang,
                    isExport: true,
                },
            },
            {
                $group: {
                    _id: { $storeId: "$storeId" },
                    total: {
                        $sum: { $multiply: ["$quality", "$price"] },
                    },
                },
            },
        ]);
        return doanhThu;
    }

    async doanhThuNgayTrongThangStore(storeId: string, thang: number, nam: number) {
        const data = await this.lichSuKhoHangModel.aggregate([
            {
                $match: {
                    storeId,
                    month: thang,
                    year: nam,
                    isExport: true,
                },
            },
            {
                _id: { storeId: "$storeId", date: "$date" },
                date: { $first: "$date" },
                total: {
                    $sum: {
                        $multiply: ["$quality", "$price"],
                    },
                },
            },
        ]);
        return data;
    }
}
