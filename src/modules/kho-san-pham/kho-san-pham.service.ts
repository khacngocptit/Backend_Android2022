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
import { LichSuKhoHang, LichSuKhoHangDocument } from "./entities/lich-su-kho.entity";
import * as bluebird from "bluebird";
import * as moment from "moment";

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
        const { quantity, ...update } = data;
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
                    quantity: quantity,
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
                    quantity: nhapKho.quantity,
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
        const isRoot = await this.cuaHangModel.findOne({ isRoot: true, userId: storeId });
        /** 
         * Kiem tra 
        */
        const khoCon = await this.khoSanPhamModel.findOne({
            productId: phanKho.productId,
            storeId: phanKho.storeId,
        });
        let diff = 0;
        if (khoCon) {
            diff = khoCon.quantity - phanKho.quantity;
        } else {
            diff = -phanKho.quantity;
        }
        const xuatKhoTong = await this.khoSanPhamModel.findOneAndUpdate({
            storeId: isRoot._id,
            productId: phanKho.productId,
            quantity: { $gte: phanKho.quantity },
        }, {
            $inc: {
                quantity: diff,
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
                $set: {
                    quantity: phanKho.quantity,
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
        const xuatKho = body as LichSuKhoHang;
        xuatKho.isExport = true;
        xuatKho.day = moment(body.date).date();
        xuatKho.month = moment(body.date).month();
        xuatKho.year = moment(body.date).year();
        const { quantity, ...update } = xuatKho;
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
                $set: {
                    ...update,
                },
                $inc: {
                    quantity,
                },
            },
            {
                upsert: true,
            }
        );
        const khoSanPham = await this.khoSanPhamModel.findOneAndUpdate(
            {
                productId: xuatKho.productId,
                storeId: xuatKho.storeId,
                quantity: { $gte: xuatKho.quantity },
            },
            {
                $inc: {
                    quantity: -xuatKho.quantity,
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

    async doanhThu(userId: string) {
        const thang = moment().month();
        const nam = moment().year();
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
                    _id: "$storeId",
                    total: {
                        $sum: { $multiply: ["$quantity", "$price"] },
                    },
                    storeId: { $first: "$storeId" },
                },
            },
        ]);
        const label = [];
        const value = [];


        listStore.forEach(s => {
            let cuaHang = "";
            let vl = 0;
            doanhThu.forEach((el, index) => {
                if (s._id.toString().localeCompare(el.storeId) === 0) {
                    cuaHang = s.name;
                    vl = el.total;
                } else {
                    cuaHang = s.name;
                    vl = 0;
                }
            });
            label.push(cuaHang);
            value.push(vl);
        });


        return {
            label,
            value,
            title: `Doanh thu cac cua hang trong chuoi thang ${thang + 1}`,
        };
    }

    async doanhThuNgayTrongThangStore(storeId: string) {
        const thang = moment().month();
        const nam = moment().year();
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
                        $multiply: ["$quantity", "$price"],
                    },
                },
            },
        ]);
        return data;
    }

    async doanhThuChuoiCuaHang(storeId: string) {
        const thang = moment().month();
        const nam = moment().year();
        const cuaHangCha = await this.cuaHangModel.findOne({ userId: storeId, isRoot: true });
        if (!cuaHangCha) {
            throw ErrorDataDto.BadRequest("NOT_IS_ROOT");
        }

        const listStore: string[] = await this.cuaHangModel.find({ userId: cuaHangCha.userId }).then(el => {
            return el.map(t => t._id.toString());
        });

        const xuatKho = await this.lichSuKhoHangModel.aggregate([
            {
                $match: {
                    isExport: true,
                    storeId: { $in: listStore },
                    month: thang,
                    year: nam,
                },
            },
            {
                $group: {
                    _id: "$date",
                    day: { $first: "$day" },
                    date: { $first: "$date" },
                    total: {
                        $sum: {
                            $multiply: ["$quantity", "$price"],
                        },
                    },
                },
            },
        ]);
        const nhapKho = await this.lichSuKhoHangModel.aggregate([
            {
                $match: {
                    isExport: { $ne: true },
                    storeId: { $in: listStore },
                    month: thang,
                    year: nam,
                },
            },
            {
                $group: {
                    _id: "$date",
                    day: { $first: "$day" },
                    date: { $first: "$date" },
                    total: {
                        $sum: {
                            $multiply: ["$quantity", "$price"],
                        },
                    },
                },
            },
        ]);
        const result = [];
        for (let i = 0; i < xuatKho.length; i++) {
            for (let j = 0; j < nhapKho.length; j++) {
                if (xuatKho[i].day === nhapKho[j].day) {
                    const el = {
                        date: xuatKho[i].date,
                        day: xuatKho[i].day,
                        total: xuatKho[i].total - nhapKho[i].total,
                    };
                    result.push(el);
                    xuatKho.splice(i, 1);
                }
            }
        }
        xuatKho.forEach(el => {
            result.push({
                date: el.date,
                day: el.day,
                total: el.total,
            });
        });
        const label = [];
        const value = [];
        const dt = new Date();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 0; i < daysInMonth; i++) {
            const lb = i;
            let vl = 0;
            result.forEach(el => {
                if (i === el.day) {
                    vl = el.total;
                } else {
                    vl = 0;
                }
            });
            label.push(lb);
            value.push(vl);
        }
        return { label, value, title: `Doanh thu chuoi cua hang thang ${month + 1}` };
    }

    async deleteSanPhamTrongCuaHang(productId: string, storeId: string, userId: string) {
        const root = await this.cuaHangModel.findOne({ isRoot: true, userId });
        const data = await this.khoSanPhamModel.findOneAndDelete({ productId, storeId });
        const quantity = data.quantity;
        await this.khoSanPhamModel.findOneAndUpdate(
            {
                storeId: root._id,
                productId,
            },
            {
                $inc: {
                    quantity: quantity,
                },
            }
        );
        return null;
    }
}
