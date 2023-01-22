export class PaymentException extends Error {
    constructor(message: string) {
        super(message);
    }
}