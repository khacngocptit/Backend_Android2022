import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 } from "uuid";
import { FetchQueryOption } from "../../../common/pipe/fetch-query-option.interface";
import { DeviceDataDocument } from "../../device-data/entities/device-data.entity";
import { OneSignalService } from "../../one-signal/one-signal.service";
import { DB_DEVICE_DATA, DB_NOTIFICATION, DB_NOTIFY_READ, DB_TOPIC } from "../../repository/db-collection";
import { SettingKey } from "../../setting/common/setting.constant";
import { SettingService } from "../../setting/service/setting.service";
import { UserAuthorizedDocument } from "../../user/dto/user-authorized.dto";
import { InitTopicStatus } from "../common/notification";
import { EVERYONE_TOPIC_ID, NotificationType, NotifyReadType, TopicType } from "../common/notification.constant";
import { CreateNotificationUser } from "../dto/create-notification-user.dto";
import { CreateNotificationVaiTro } from "../dto/create-notification-vai-tro.dto";
import { NotificationCondition } from "../dto/notification-condition.dto";
import { NotificationPageable } from "../dto/notification-pageable.dto";
import { Notification, NotificationDocument } from "../entities/notification.entity";
import { NotifyReadDocument } from "../entities/notify-read.entity";
import { TopicDocument } from "../entities/topic/topic.entity";
import { NotificationRepository } from "../notification.repository";

@Injectable()
export class NotificationService implements OnModuleInit {
    private readonly logger: Logger = new Logger(NotificationService.name);

    constructor(
        @InjectModel(DB_TOPIC)
        private readonly topicModel: Model<TopicDocument>,
        @InjectModel(DB_NOTIFICATION)
        private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel(DB_DEVICE_DATA)
        private readonly deviceDataModel: Model<DeviceDataDocument>,
        @InjectModel(DB_NOTIFY_READ)
        private readonly notifyReadModel: Model<NotifyReadDocument>,

        private readonly notifRepo: NotificationRepository,
        private readonly settingService: SettingService,
        private readonly oneSignalService: OneSignalService,
    ) {}

    async onModuleInit() {
        const initStatus = (await this.settingService.getSettingValue<InitTopicStatus>(SettingKey.INIT_TOPIC_STATUS)) || {};
        if (initStatus.everyone !== true) {
            this.initEveryoneTopic();
            initStatus.everyone = true;
        } else {
            this.logger.verbose("Everyone topic initialized");
        }

        await this.settingService.setSetting({
            key: SettingKey.INIT_TOPIC_STATUS,
            value: initStatus,
        });
    }

    async initEveryoneTopic() {
        this.logger.verbose("Initializing Everyone topic");
        const res = await this.topicModel.findOneAndUpdate(
            { _id: EVERYONE_TOPIC_ID, type: TopicType.EVERYONE },
            { $set: { name: "Everyone" } },
            { upsert: true, new: true },
        );
    }

    async userGetById(u: UserAuthorizedDocument, id: string) {
        const condition = {
            _id: id,
            ...(await this.userAccessCondition(u)),
        };
        return this.notificationModel.findOne(condition);
    }

    /**
     * Gửi thông báo tới tất cả người dùng
     * @param dto Dữ liệu gửi thông báo
     * @param sender Người gửi
     * @returns Document Notification
     */
    async createNotifAll(dto: CreateNotificationUser, sender: UserAuthorizedDocument): Promise<NotificationDocument> {
        const id = v4();
        const notifDto: Notification = {
            _id: id,
            senderName: `${sender.profile?.lastname} ${sender.profile?.firstname}`,
            senderId: String(sender._id),
            notifType: NotificationType.TAT_CA,
            ...dto,
            oneSignalData: {
                id,
                notifType: NotificationType.TAT_CA,
            },
        };
        const doc = await this.createNotification(notifDto);
        this.oneSignalService.sendToAll(doc);
        return doc;
    }

    /**
     * Gửi thông báo tới một tập người dùng cụ thể
     * @param dto Dữ liệu gửi thông báo
     * @param sender Người gửi
     * @returns Document Notification
     */
    async createNotifUser(dto: CreateNotificationUser, sender: UserAuthorizedDocument): Promise<NotificationDocument> {
        const id = v4();
        const notifDto: Notification = {
            _id: id,
            senderName: `${sender.profile?.lastname} ${sender.profile?.firstname}`,
            senderId: String(sender._id),
            notifType: NotificationType.TAI_KHOAN,
            ...dto,
            oneSignalData: {
                id,
                notifType: NotificationType.TAI_KHOAN,
            },
        };
        const doc = await this.createNotification(notifDto);
        this.oneSignalService.sendToUserIds(doc, dto.userIds);
        return doc;
    }

    /**
     * Gửi thông báo tới các người dùng theo vai trò
     * @param dto Dữ liệu gửi thông báo
     * @param sender Người gửi
     * @returns Document Notification
     */
    async createNotifVaiTro(dto: CreateNotificationVaiTro, sender: UserAuthorizedDocument): Promise<NotificationDocument> {
        const id = v4();
        const notifDto: Notification = {
            _id: id,
            senderName: `${sender.profile?.lastname} ${sender.profile?.firstname}`,
            senderId: String(sender._id),
            notifType: NotificationType.VAI_TRO,
            ...dto,
            oneSignalData: {
                id,
                notifType: NotificationType.VAI_TRO,
            },
        };
        const doc = await this.createNotification(notifDto);
        this.oneSignalService.sendToVaiTro(doc, dto.roles);
        return doc;
    }

    async userAccessCondition(u: UserAuthorizedDocument) {
        const $or = [
            { notifType: NotificationType.TAT_CA },
            { notifType: NotificationType.HE_THONG },
            {
                notifType: NotificationType.TAI_KHOAN,
                userIds: String(u._id),
            },
            {
                notifType: NotificationType.VAI_TRO,
                roles: u.systemRole,
            },
        ];
        return { $or };
    }

    async getPageable(condition: NotificationCondition, option: FetchQueryOption): Promise<NotificationPageable> {
        return this.notifRepo.getPaging(condition, option);
    }

    async userGetNotif(
        u: UserAuthorizedDocument,
        option: FetchQueryOption,
        condition: NotificationCondition,
    ): Promise<NotificationPageable> {
        const finalConditions = {
            $and: [await this.userAccessCondition(u), condition],
        };
        const res = await this.notifRepo.getPaging(finalConditions, option);
        res.result = await this.assignReadStatus(u, res.result);
        return res;
    }

    private async assignReadStatus(
        user: UserAuthorizedDocument,
        notifList: NotificationDocument[],
    ): Promise<NotificationDocument[]> {
        const userId = String(user._id);
        const [readAll, readOneSet] = await Promise.all([
            this.notifyReadModel.findOne({ userId, type: NotifyReadType.ALL }).select("readAt"),
            this.notifyReadModel
                .find({ userId, type: NotifyReadType.ONE })
                .then((res) => new Set(res.map((read) => String(read.notificationId)))),
        ]);
        return notifList.map((notif) => {
            const unread = !readOneSet.has(String(notif._id)) && (!readAll || readAll.readAt < notif.createdAt);
            notif.set("unread", unread, { strict: false });
            return notif;
        });
    }

    async createNotification(dto: Notification) {
        // Create Notification
        const doc = new this.notificationModel(dto);
        // return doc;
        return doc.save();
    }
}
