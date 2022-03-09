import { Client } from "onesignal-node";
import { Notification } from "../notification/entities/notification.entity";
export type OneSignalClient = Client;

export interface SendOneSignalJobData {
    oneSignalId?: string;
    oneSignalIds?: string[];
    notif: Notification;
}
