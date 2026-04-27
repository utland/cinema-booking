import { registerAs } from "@nestjs/config";

export interface IStripeConfig {
    secret: string;
}

export const stripeConfig = registerAs(
    "stripe",
    (): IStripeConfig => ({
        secret: process.env.STRIPE_SECRET as string
    })
);
