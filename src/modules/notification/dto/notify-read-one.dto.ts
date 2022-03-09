import { PickType } from "@nestjs/swagger";
import { NotifyRead } from "../entities/notify-read.entity";

export class NotifyReadOne extends PickType(NotifyRead, ["notificationId"]) {}
