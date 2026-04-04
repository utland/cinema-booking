import { PaymentService } from "src/application/extrenal-services/ports/payment.service";

export class StripeService implements PaymentService {
    public async createPayment(token: string, amount: number): Promise<boolean> {
        return true;
    }
}