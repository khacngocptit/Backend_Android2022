import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { JobOptions, Queue } from "bull";
import { DocumentQuery } from "mongoose";
import { QueueName } from "../../config/constant";
import { DeviceDataDocument } from "../device-data/entities/device-data.entity";
import { Notification } from "../notification/entities/notification.entity";
import { OneSignalQueueType } from "./common/one-signal.constant";
import { SendOneSignalJobData } from "./one-signal";

@Injectable()
export class OneSignalQueueService {
    constructor(
        @InjectQueue(QueueName.ONE_SIGNAL)
        private readonly oneSignalQueue: Queue,
    ) {}

    /**
     *
     * @param findQuery MongoDB query to find device data which are going to receive notification
     * @param notif Notification
     */
    handleSendBatch(findQuery: DocumentQuery<DeviceDataDocument[], DeviceDataDocument>, notif: Notification) {
        const list: string[] = [];
        const jobOptions: JobOptions = {
            delay: 32,
            removeOnFail: true,
            removeOnComplete: true,
        };
        findQuery
            .cursor()
            .on("data", (deviceData: DeviceDataDocument) => {
                list.push(deviceData.oneSignalId);
                if (list.length >= 2000) {
                    const batch = list.splice(2000);
                    const data: SendOneSignalJobData = {
                        oneSignalIds: batch,
                        notif,
                    };
                    this.oneSignalQueue.add(OneSignalQueueType.SEND_BATCH, data, jobOptions);
                }
            })
            .on("end", () => {
                if (list.length > 0) {
                    const data: SendOneSignalJobData = {
                        oneSignalIds: list,
                        notif,
                    };
                    this.oneSignalQueue.add(OneSignalQueueType.SEND_BATCH, data, jobOptions);
                }
            })
            .on("error", (err) => {
                console.error("Error handle send batch", err);
            });
    }
}
