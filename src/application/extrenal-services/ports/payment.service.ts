export type PaymentStatus = "success" | "cancel" | "request-approve" | "server-error";

export class PaymentResultDto {
    status: PaymentStatus;
    transactionId: string;
}

export const PAYMENT_SERVICE_TOKEN = "PaymentService";

export interface PaymentService {
    createPayment(token: string, amount: number): Promise<PaymentResultDto | null>;
}
