export const PAYMENT_SERVICE_TOKEN = 'PaymentService';

export interface PaymentService {
    createPayment(token: string, amount: number): Promise<boolean>;
}