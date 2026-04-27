import { Injectable } from "@nestjs/common";
import { PaymentIntent, PaymentIntentStatus } from "./stripe.types";
import { PaymentResultDto, PaymentStatus } from "@app/booking/application/ports/dto/payment-result.dto";

@Injectable()
export class StripeMapper {
    public toDtoFormat(intent: PaymentIntent): PaymentResultDto {
        return {
            status: this.getStatus(intent.status),
            clientSecret: intent.client_secret
        };
    }

    private getStatus(stripeStatus: PaymentIntentStatus): PaymentStatus {
        switch (stripeStatus) {
            case "succeeded":
                return "success";
            case "requires_action":
                return "request-approve";
            default:
                return "cancel";
        }
    }
}
