export class InvalidSmsCodeException extends Error {
    constructor() {
        super('Invalid sms code!');
    }
}
