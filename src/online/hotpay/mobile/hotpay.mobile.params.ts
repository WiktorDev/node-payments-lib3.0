import {IsNumber, IsString, IsUrl} from "class-validator";

export class HotpayMobileParams {
    SEKRET: string

    @IsNumber()
    KWOTA: number

    @IsString()
    NAZWA_USLUGI: string

    @IsUrl()
    PRZEKIEROWANIE_SUKCESS: string

    @IsUrl()
    PRZEKIEROWANIE_BLAD: string

    @IsString()
    ID_ZAMOWIENIA: string

    constructor(secret: string) {
        this.SEKRET = secret
    }
}