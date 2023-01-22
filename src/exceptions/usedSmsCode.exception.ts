export class UsedSmsCodeException extends Error {
    constructor() {
        super('This code already used!');
    }
}
