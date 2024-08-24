import { BasePayment } from "../../../BasePayment";
import { SimpayOnlineParams } from "./simpayOnline.params";
import { validateObject } from "../../../utils/validate.function";
import { hash } from "../../../utils/crypto.function";
import { HashingMethodsEnum } from "../../../enums/HashingMethodsEnum";
import { PaymentException } from "../../../exceptions/payment.exception";
import { PaymentGeneratedEntity } from "../../../entities/paymentGenerated.entity";

export class SimpayOnlinePayment extends BasePayment {
    private readonly token: string;
    private readonly serviceId: number;
    private readonly serviceHash: string;
    public readonly params: SimpayOnlineParams;

    constructor(token: string, serviceId: number, serviceHash: string) {
        super();
        this.token = token;
        this.serviceId = serviceId;
        this.serviceHash = serviceHash;
        this.params = new SimpayOnlineParams();
    }

    public async generatePayment(): Promise<PaymentGeneratedEntity> {
        await validateObject(SimpayOnlineParams, this.params);
        // this.params.signature = this.getPaymentSignature();

        const response = await this.doRequest(`https://api.simpay.pl/payment/${this.serviceId}/transactions`, 'POST', this.params, {
            'Authorization': `Bearer ${this.token}`
        });

        if (response && response.status !== 200)
            throw new PaymentException(`[SimPay] ${response.data['message']}`);

        return new PaymentGeneratedEntity(response.data['data']['redirectUrl'], response.data['data']['transactionId']);
    }

    // private getPaymentSignature(): string {
    //     const array = [];
    //     array.push(this.params.amount);
    //     if (this.params.currency) array.push(this.params.currency);
    //     if (this.params.description) array.push(this.params.description);
    //     if (this.params.control) array.push(this.params.control);
    //     if (this.params.customer && this.params.customer.name) array.push(this.params.customer.name);
    //     if (this.params.customer && this.params.customer.email) array.push(this.params.customer.email);
    //     if (this.params.returns?.success) array.push(this.params.returns.success);
    //     if (this.params.returns?.failure) array.push(this.params.returns.failure);
    //     if (this.params.channels) array.push(this.params.channels.join(','));

    //     array.push(this.serviceHash);

    //     return hash(HashingMethodsEnum.SHA256, `${array.join('|')}`);
    // }

    public generateNotificationSignature(payload: any): string {
        const filteredPayload = { ...payload };
        delete filteredPayload.signature;
        const signatureString = Object.values(filteredPayload).join('|');
        const stringToHash = `${signatureString}|${this.serviceHash}`;
        return hash(HashingMethodsEnum.SHA256, stringToHash);
    }
}