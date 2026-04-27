import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "apps/booking/src/core/config/config.types";
import StripeConstructor, { Stripe } from "stripe";
import { PaymentIntent } from "./stripe.types";
import { IStripeConfig } from "apps/booking/src/core/config/stripe.config";

@Injectable()
export class StripeFacade {
    private readonly stripe: Stripe;

    constructor(private readonly configService: ConfigService<ConfigType>) {
        const { secret } = this.configService.get("stripe") as IStripeConfig;
        this.stripe = StripeConstructor(secret);
    }

    public async createPaymentIntent(amount: number, paymentMethodId: string): Promise<PaymentIntent | null> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: "uah",
                payment_method: paymentMethodId,
                confirm: true
            });

            return paymentIntent;
        } catch {
            return null;
        }
    }
}
