import StripeConstructor from "stripe";

type StripeClass = StripeConstructor.Stripe;

export type PaymentIntent = Awaited<ReturnType<StripeClass["paymentIntents"]["create"]>>;

export type PaymentIntentStatus = PaymentIntent["status"];
