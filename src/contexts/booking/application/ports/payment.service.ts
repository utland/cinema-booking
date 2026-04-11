import { PaymentResultDto } from "./dto/payment-result.dto";

export const PAYMENT_SERVICE_TOKEN = "PaymentService";

export interface PaymentService {
    chargePayment(token: string, amount: number): Promise<PaymentResultDto | null>;
}
