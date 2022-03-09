import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bull";
import { QueueName } from "../../config/constant";
import { OneSignalQueueType } from "./common/one-signal.constant";
import { OneSignalClient, SendOneSignalJobData } from "./one-signal";
import { ONE_SIGNAL_CLIENT } from "./one-signal-client";

@Processor(QueueName.ONE_SIGNAL)
export class SendOneSignalProcessor {
    private readonly logger = new Logger(SendOneSignalProcessor.name);

    constructor(
        @Inject(ONE_SIGNAL_CLIENT)
        private readonly oneSignalClient: OneSignalClient,
    ) {}

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.verbose(`Processing job ${job.id} of type ${job.name}`);
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.verbose(`Completed job ${job.id} of type ${job.name}`);
    }

    @OnQueueFailed()
    onError(job: Job, error: Error) {
        console.error(`Failed job ${job.id} of type ${job.name} with error: ${error.message}`);
    }

    @Process(OneSignalQueueType.SEND_BATCH)
    async sendBatch(job: Job<SendOneSignalJobData>) {
        const { oneSignalIds, notif } = job.data;
        const res = await this.oneSignalClient.createNotification({
            include_player_ids: oneSignalIds,
            headings: { en: notif.title },
            contents: { en: notif.content },
            adm_big_picture: notif.imageUrl,
            chrome_web_image: notif.imageUrl,
            data: notif.oneSignalData,
        });
        this.logger.verbose(`${res.statusCode} ${JSON.stringify(res.body)}`);
    }
}
