export type PaymentStatus = "success" | "cancel" | "request-approve" | "server-error";

export class PaymentResultDto {
    status: PaymentStatus;
    clientSecret: string | null;
}
