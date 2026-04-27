export const SENDER_SERVICE_TOKEN = "SenderService";

export interface SenderService {
    sendEmail(to: string, message: string): Promise<void>;
}
