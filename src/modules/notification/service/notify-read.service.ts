import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_NOTIFY_READ } from "../../repository/db-collection";
import { UserAuthorizedDocument } from "../../user/dto/user-authorized.dto";
import { NotifyReadType } from "../common/notification.constant";
import { NotifyReadOne } from "../dto/notify-read-one.dto";
import { NotifyReadDocument } from "../entities/notify-read.entity";

@Injectable()
export class NotifyReadService {
    constructor(
        @InjectModel(DB_NOTIFY_READ)
        private readonly notifyReadModel: Model<NotifyReadDocument>,
    ) {}

    async readOne(user: UserAuthorizedDocument, dto: NotifyReadOne): Promise<NotifyReadDocument> {
        return this.notifyReadModel.findOneAndUpdate(
            { userId: String(user._id), notificationId: dto.notificationId, type: NotifyReadType.ONE },
            { $set: { readAt: new Date() } },
            { upsert: true, new: true },
        );
    }

    async readAll(user: UserAuthorizedDocument): Promise<NotifyReadDocument> {
        const userId = String(user._id);
        return this.notifyReadModel
            .findOneAndUpdate(
                { userId, type: NotifyReadType.ALL },
                { $set: { readAt: new Date() } },
                { upsert: true, new: true },
            )
            .then((res) => {
                this.notifyReadModel.deleteMany({ userId, readAt: { $lt: res.readAt } }).exec();
                return res;
            });
    }
}
