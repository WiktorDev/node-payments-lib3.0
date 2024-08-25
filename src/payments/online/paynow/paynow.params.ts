import {
  IsEmail,
  IsIn, IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested
} from "class-validator";

export class PaynowParams {
  @IsNumber()
  amount: number

  @IsOptional()
  @IsIn(['PLN', 'EUR', 'USD', 'GBP', 'CZK'])
  currency: "PLN" | "EUR" | "USD" | "GBP" | "CZK"

  @IsString()
  externalId: string

  @IsString()
  description: string

  @IsUrl()
  continueUrl: string

  @ValidateNested()
  buyer: Buyer

  @IsOptional()
  @ValidateNested({ each: true })
  orderItems: OrderItem[]

  @IsOptional()
  @IsNumber()
  validityTime: number

  @IsOptional()
  @IsString()
  payoutAccount: string
}

class OrderItem {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  producer: string

  @IsString()
  category: string

  @IsNumber()
  quantity: number

  @IsNumber()
  price: number
}

class Buyer {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @ValidateNested()
  phone: Phone

  @IsOptional()
  @ValidateNested()
  address: Address

  @IsOptional()
  @IsString()
  locale: string

  @IsOptional()
  @IsString()
  externalId: string
}

class Phone {
  @MaxLength(5)
  prefix: string

  @MaxLength(10)
  number: number
}

class Address {
  @IsOptional()
  billing: BillingAddress

  @IsOptional()
  shipping: ShippingAddress
}

class BillingAddress {
  @IsOptional()
  @IsString()
  street: string

  @IsOptional()
  @IsString()
  houseNumber: string

  @IsOptional()
  @IsString()
  apartmentNumber: string

  @IsOptional()
  @Matches(/[0-9]{2}-[0-9]{3}/)
  zipcode: string

  @IsOptional()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  country: string
}

class ShippingAddress {
  @IsOptional()
  @IsString()
  street: string

  @IsOptional()
  @IsString()
  houseNumber: string

  @IsOptional()
  @IsString()
  apartmentNumber: string

  @IsOptional()
  @Matches(/[0-9]{2}-[0-9]{3}/)
  zipcode: string

  @IsOptional()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  country: string
}