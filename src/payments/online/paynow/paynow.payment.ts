import {BasePayment} from "../../../BasePayment";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {validateObject} from "../../../utils/validate.function";
import {SimpayDirectbillingParams} from "../simpay/simpayDirectbilling.params";
import {PaymentException} from "../../../exceptions/payment.exception";
import {PaynowParams} from "./paynow.params";
import {createHmac} from "crypto";

export class PaynowPayment extends BasePayment {
  private readonly apikey: string
  private readonly signatureKey: string
  private readonly idempotencyKey: string
  private readonly sandbox: boolean
  public readonly params: PaynowParams

  constructor(apikey: string, signatureKey: string, idempotencyKey: string, sandbox: boolean = false) {
    super();
    this.apikey = apikey
    this.idempotencyKey = idempotencyKey
    this.params = new PaynowParams()
    this.sandbox = sandbox
    this.signatureKey = signatureKey
  }

  public async generatePayment(): Promise<PaymentGeneratedEntity>{
    await validateObject(PaynowParams, this.params)
    const signature = this.generateV3(JSON.stringify(this.params))
    const response = await this.doRequest(`https://api${this.sandbox ? '.sandbox' : ''}.paynow.pl/v3/payments`, "POST", this.params, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Api-Key': this.apikey,
        'Signature': signature,
        'Idempotency-Key': this.idempotencyKey
      }
    })

    if (response && response.status !== 201)
      throw new PaymentException(`[SimPay] ${response.data['message']}`)

    return new PaymentGeneratedEntity(response.data['redirectUrl'], response.data['paymentId'])
  }

  public generateSignature(payload: any): string {
    return this.generateV3(JSON.stringify(payload).replace(/\\\//g, '/'))
  }

  private generateV3(data = '', parameters: any = {}) {
    const parsedParameters: any = {};

    for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        parsedParameters[key] = Array.isArray(parameters[key]) ? parameters[key] : [parameters[key]];
      }
    }

    const signatureBody = {
      headers: {
        'Api-Key': this.apikey,
        'Idempotency-Key': this.idempotencyKey,
      },
      parameters: Object.keys(parsedParameters).length ? parsedParameters : {},
      body: data
    };

    const signatureString = JSON.stringify(signatureBody).replace(/\\\//g, '/');
    const hmac = createHmac('sha256', this.signatureKey);
    hmac.update(signatureString);
    return hmac.digest('base64');
  }
}