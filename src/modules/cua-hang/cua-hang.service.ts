import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_CUA_HANG } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { CuaHangDocument } from "./entities/cua-hang.entity";

@Injectable()
export class CuaHangService extends MongoRepository<CuaHangDocument> {
    constructor(
        @InjectModel(DB_CUA_HANG)
        private readonly cuaHangModel: Model<CuaHangDocument>,
    ) {
        super(cuaHangModel);
    }
}
