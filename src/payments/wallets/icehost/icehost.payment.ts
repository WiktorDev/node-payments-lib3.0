import {BasePayment} from "../../../BasePayment";
import {PaymentGeneratedEntity} from "../../../entities/paymentGenerated.entity";
import {IcehostParams} from "./icehost.params";
import {validateObject} from "../../../utils/validate.function";
import {PaymentException} from "../../../exceptions/payment.exception";

export class IcehostPayment extends BasePayment {
  private apikey: string;
  params: IcehostParams

  constructor(apikey: string) {
	super();
	this.apikey = apikey;
	this.params = new IcehostParams()
  }

  async generatePayment(): Promise<PaymentGeneratedEntity> {
	await validateObject(IcehostParams, this.params)
	const response = await this.doRequest('https://dash.icehost.pl/api/client/wallet/up', "POST", this.params, {
	  'Authorization': `Bearer ${this.apikey}`,
	  'Content-Type': 'application/json'
	})
	if (response.status !== 200)
	  throw new PaymentException(`[IceHost] ${response.data.errors[0].code}`)
	return new PaymentGeneratedEntity(response.data.url, response.data.id);
  }
}
