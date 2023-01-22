export class CashbillTransactionEntity {
    id: string
    amount: {
        value: number
        currencyCode: string
    }
    requestedAmount: {
        value: number
        currencyCode: string
    }
    title: string
    description: string
    personalData: {
        firstName: string
        surname: string
        email: string
        country: string
        city: string
        postcode: string
        street: string
        house: string
        flat: string
        ip: string
    }
    additionalData: string
    status: string
}