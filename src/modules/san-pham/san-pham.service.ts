import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_SAN_PHAM } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { SanPhamDocument } from "./entities/san-pham.entity";

@Injectable()
export class SanPhamService extends MongoRepository<SanPhamDocument>{
    constructor(
        @InjectModel(DB_SAN_PHAM)
        private readonly sanPhamModel: Model<SanPhamDocument>
    ) {
        super(sanPhamModel);
    }
}
