import { Injectable } from "@nestjs/common";
import { PaymentService } from "../../../application/ports/payment.service";
import { StripeFacade } from "./stripe.facade";
import { PaymentResultDto } from "src/contexts/booking/application/ports/dto/payment-result.dto";
import { StripeMapper } from "./stripe.mapper";

@Injectable()
export class StripePaymentService implements PaymentService {
    constructor(
        private readonly stripeFacade: StripeFacade,
        private readonly stripeMapper: StripeMapper
    ) {}

    public async chargePayment(token: string, amount: number): Promise<PaymentResultDto | null> {
        const result = await this.stripeFacade.createPaymentIntent(amount, token);
        if (!result) return null;

        return this.stripeMapper.toDtoFormat(result);
    }
}
