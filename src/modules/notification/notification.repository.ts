import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_NOTIFICATION } from "../repository/db-collection";
import { MongoRepository } from "../repository/mongo-repository";
import { NotificationDocument } from "./entities/notification.entity";

@Injectable()
export class NotificationRepository extends MongoRepository<NotificationDocument> {
    constructor(
        @InjectModel(DB_NOTIFICATION)
        private readonly notificationModel: Model<NotificationDocument>,
    ) {
        super(notificationModel);
    }
}
