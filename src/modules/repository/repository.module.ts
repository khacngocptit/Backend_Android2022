import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CuaHangSchema } from "../cua-hang/entities/cua-hang.entity";
import { DanhMucSanPhamSchema } from "../danh-muc-san-pham/entities/danh-muc-san-pham.entity";
import { DeviceDataSchema } from "../device-data/entities/device-data.entity";
import { FileManagerProvider } from "../file-manager/entities/file-manager.entity";
import { KhoSanPhamSchema } from "../kho-san-pham/entities/kho-san-pham.entity";
import { LichSuKhoHangSchema } from "../kho-san-pham/entities/lich-su-kho.entity";
import { JoinTopicSchema } from "../notification/entities/join-topic.entity";
import { NotificationSchema } from "../notification/entities/notification.entity";
import { NotifyReadSchema } from "../notification/entities/notify-read.entity";
import { TopicSchema } from "../notification/entities/topic/topic.entity";
import { SanPhamSchema } from "../san-pham/entities/san-pham.entity";
import { SettingSchema } from "../setting/entities/setting.entity";
import { UserSchema } from "../user/entities/user.entity";
import * as db from "./db-collection";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: db.DB_SETTING, schema: SettingSchema },
            { name: db.DB_USER, schema: UserSchema },
            // { name: db.DB_PROFILE, schema: ProfileSchema },
            { name: db.DB_DEVICE_DATA, schema: DeviceDataSchema },
            { name: db.DB_NOTIFICATION, schema: NotificationSchema },
            { name: db.DB_TOPIC, schema: TopicSchema },
            { name: db.DB_JOIN_TOPIC, schema: JoinTopicSchema },
            { name: db.DB_NOTIFY_READ, schema: NotifyReadSchema },
            { name: db.DB_CUA_HANG, schema: CuaHangSchema },
            { name: db.DB_SAN_PHAM, schema: SanPhamSchema },
            { name: db.DB_DANH_MUC_SAN_PHAM, schema: DanhMucSanPhamSchema },
            { name: db.DB_LICH_SU_KHO_HANG, schema: LichSuKhoHangSchema },
            { name: db.DB_KHO_SAN_PHAM, schema: KhoSanPhamSchema },
        ]),
    ],
    providers: [FileManagerProvider],
    exports: [FileManagerProvider, MongooseModule],
})
export class RepositoryModule { }
