import {IsEmail, IsNumber, IsOptional, IsString, IsUrl} from "class-validator";

export class HotpayParams {
    @IsNumber()
    KWOTA: number

    @IsString()
    NAZWA_USLUGI: string

    @IsUrl()
    ADRES_WWW: string

    @IsString()
    ID_ZAMOWIENIA: string

    @IsOptional()
    @IsEmail()
    EMAIL?: string

    @IsOptional()
    @IsString()
    DANE_OSOBOWE?: string

    private SEKRET: string
    HASH: string
    TYP="INIT"

    constructor(secret: string) {
        this.SEKRET = secret;
    }
}