import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_DANH_MUC_SAN_PHAM } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { DanhMucSanPhamDocument } from "./entities/danh-muc-san-pham.entity";

@Injectable()
export class DanhMucSanPhamService extends MongoRepository<DanhMucSanPhamDocument>{
    constructor(
        @InjectModel(DB_DANH_MUC_SAN_PHAM)
        private readonly danhMucSanPhamModel: Model<DanhMucSanPhamDocument>
    ) {
        super(danhMucSanPhamModel);
    }
}
