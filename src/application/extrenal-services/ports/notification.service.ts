export const NOTIFICATION_SERVICE_TOKEN = "NotificationService";

export interface NotificationService {
    sendEmail(to: string, message: string): Promise<void>;
}
