import {BasePayment} from "../../BasePayment";
import {PaymentGeneratedEntity} from "../../entities/paymentGenerated.entity";
import {PaypalParams} from "./paypal.params";
import {validateObject} from "../../utils/validate.function";
import {PaymentException} from "../../exceptions/payment.exception";

export class PaypalPayment extends BasePayment {
  private clientId: string
  private clientSecret: string
  private apiUrl: string
  params: PaypalParams

  constructor(clientId: string, clientSecret: string, sandbox: boolean = false) {
	super();
	this.clientId = clientId
	this.clientSecret = clientSecret
	this.params = new PaypalParams()
	this.apiUrl = `${sandbox ? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com'}/v1`
  }

  async generatePayment(): Promise<PaymentGeneratedEntity> {
	await validateObject(PaypalParams, this.params)
	const data = JSON.stringify({
	  "intent": "sale",
	  "payer": {
		"payment_method": "paypal"
	  },
	  "redirect_urls": {
		"return_url": this.params.return_url,
		"cancel_url": this.params.cancel_url
	  },
	  "transactions": [{
		"item_list": {
		  "items": [{
			"name": this.params.itemName,
			"sku": "001",
			"price": this.params.itemPrice,
			"currency": "PLN",
			"quantity": 1
		  }]
		},
		"amount": {
		  "currency": "PLN",
		  "total": this.params.itemPrice
		},
		"description": this.params.description
	  }]
	});

	const response = await this.doRequest(`${this.apiUrl}/payments/payment`, 'POST', data, {
	  'Content-Type': 'application/json'
	}, {
	  username: this.clientId,
	  password: this.clientSecret
	})

	if (response.status !== 201)
	  throw new PaymentException('[PayPal]' + response.data.error ? response.data.error_description : response.data.message)
	return new PaymentGeneratedEntity(response.data.links[1].href, response.data.id);
  }

  async getTransactionInfo(transactionId: string): Promise<any> {
	const response = await this.doRequest(`${this.apiUrl}/payments/payment/${transactionId}`, 'GET', null, null, {
	  username: this.clientId,
	  password: this.clientSecret
	})
	if (response.status !== 200)
	  throw new PaymentException('[PayPal]' + response.data.error ? response.data.error_description : response.data.message)
	return response.data
  }

  async verifyWebhookSignature(webhookId: string, headers: any, body: any) {
	const data = JSON.stringify({
	  "auth_algo": headers['paypal-auth-algo'],
	  "cert_url": headers['paypal-cert-url'],
	  "transmission_id": headers['paypal-transmission-id'],
	  "transmission_sig": headers['paypal-transmission-sig'],
	  "transmission_time": headers['paypal-transmission-time'],
	  "webhook_id": webhookId,
	  "webhook_event": body
	});

	const response = await this.doRequest(`${this.apiUrl}/notifications/verify-webhook-signature`, 'POST', data, {
	  'Content-Type': 'application/json'
	}, {
	  username: this.clientId,
	  password: this.clientSecret
	})
	if (response.status !== 200)
	  throw new PaymentException('[PayPal]' + response.data.error ? response.data.error_description : response.data.message)
	return response
  }

  async execute(transactionId: string, payerId: string) {
	const response = await this.doRequest(`${this.apiUrl}/payments/payment/${transactionId}/execute`, 'POST', JSON.stringify({
	  payer_id: payerId
	}), {
	  'Content-Type': 'application/json'
	}, {
	  username: this.clientId,
	  password: this.clientSecret
	})
	if (response.status !== 200)
	  throw new PaymentException('[PayPal]' + response.data.error ? response.data.error_description : response.data.message)
	return response
  }
}
