import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PeriodOfTime, SettingKey } from "../common/setting.constant";
import { SettingDocument } from "../entities/setting.entity";
import { DB_SETTING } from "./../../repository/db-collection";
import { CreateSettingDTO } from "./../dto/create-setting.dto";
import * as moment from "moment";

@Injectable()
export class SettingService {
    constructor(
        @InjectModel(DB_SETTING)
        private readonly settingModel: Model<SettingDocument>,
    ) {}

    create(createSettingDto: CreateSettingDTO) {
        return this.settingModel.create(createSettingDto);
    }

    getSetting(key: SettingKey) {
        return this.settingModel.findOne({ key });
    }

    async getSettingValue<T = any>(key: SettingKey): Promise<T> {
        const res = await this.settingModel.findOne({ key });
        return res?.value;
    }

    setSetting(data: CreateSettingDTO) {
        return this.settingModel.findOneAndUpdate(
            { key: data.key },
            { $set: data },
            {
                runValidators: true,
                new: true,
                upsert: true,
            },
        );
    }

    async getPeriodOfTime(date: Date) {
        const now = moment(date).format("HH:mm");
        if (now >= "04:00" && now < "13:30") {
            return PeriodOfTime.MORNING;
        } else {
            return PeriodOfTime.AFTERNOON;
        }
    }
}
