export class CashbillParams {
    title: string
    'amount.value': number
    'amount.currencyCode': string
    returnUrl?: string
    description?: string
    negativeReturnUrl?: string
    additionalData?: string
    paymentChannel?: string
    languageCode?: string
    referer?: string
    'personalData.firstName'?: string
    'personalData.surname'?: string
    'personalData.email'?: string
    sign: string
}