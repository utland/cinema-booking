import { SenderService } from "../../application/ports/sender.port";

export class NodemailerService implements SenderService {
    public async sendEmail(to: string, message: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
}
