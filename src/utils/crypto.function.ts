import { createHash, createHmac } from 'crypto'
import {HashingMethodsEnum} from "../enums/HashingMethodsEnum";

export function hash(hashType: HashingMethodsEnum, text: string): string {
    return createHash(hashType.toLowerCase()).update(text).digest('hex')
}

export function hmac(hashType: HashingMethodsEnum, text: string, key: string): string {
    return createHmac(hashType.toLowerCase(), key).update(text).digest("hex")
}
