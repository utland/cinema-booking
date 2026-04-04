import { NotificationService } from "src/application/extrenal-services/ports/notification.service";

export class NodemailerService implements NotificationService {
    public async sendEmail(to: string, message: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 5000));
    }
}