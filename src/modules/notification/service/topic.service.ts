import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeviceDataDocument } from "../../device-data/entities/device-data.entity";
import { DB_DEVICE_DATA, DB_JOIN_TOPIC, DB_NOTIFICATION } from "../../repository/db-collection";
import { SettingService } from "../../setting/service/setting.service";
import { JoinTopicDocument } from "../entities/join-topic.entity";
import { NotificationDocument } from "../entities/notification.entity";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(DB_JOIN_TOPIC)
        private readonly joinTopicModel: Model<JoinTopicDocument>,
        @InjectModel(DB_NOTIFICATION)
        private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,

        private readonly settingService: SettingService,
    ) {}
}
