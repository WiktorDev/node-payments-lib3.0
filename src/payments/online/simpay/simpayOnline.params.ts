import {IsNumber, IsOptional, IsString, IsUrl, IsArray, ValidateNested, IsBoolean} from "class-validator";
import {Type} from "class-transformer";

export class SimpayOnlineParams {
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    control?: string;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Customer)
    customer?: Customer;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => PaymentDetails)
    billing?: PaymentDetails;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => PaymentDetails)
    shipping?: PaymentDetails;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CartItem)
    cart?: CartItem[];

    @IsOptional()
    @ValidateNested()
    @Type(() => ReturnUrls)
    returns?: ReturnUrls = new ReturnUrls();

    @IsOptional()
    @IsString()
    directChannel?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    channels?: string[];

    @IsOptional()
    @ValidateNested()
    @Type(() => ChannelTypes)
    channelTypes?: ChannelTypes;

    @IsOptional()
    @IsString()
    referer?: string;

    // signature: string;
}

class ReturnUrls {
    @IsOptional()
    @IsUrl()
    success?: string;

    @IsOptional()
    @IsUrl()
    failure?: string;
}

class Customer {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;
}

class PaymentDetails {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    surname?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    building?: string;

    @IsOptional()
    @IsString()
    flat?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    region?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    company?: string;
}

class CartItem {
    @IsString()
    name: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    producer?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    code?: string;
}

class ChannelTypes {
    @IsOptional()
    @IsBoolean()
    blik?: boolean;

    @IsOptional()
    @IsBoolean()
    transfer?: boolean;

    @IsOptional()
    @IsBoolean()
    cards?: boolean;

    @IsOptional()
    @IsBoolean()
    ewallets?: boolean;

    @IsOptional()
    @IsBoolean()
    paypal?: boolean;
}