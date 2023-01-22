import {ClassConstructor, plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {ValidationException} from "../exceptions/validation.exception";

export const validateObject = async <T extends ClassConstructor<any>>(dto: T, obj: Object) => {
    const objInstance = plainToClass(dto, obj);
    const errors = await validate(objInstance);

    if (errors.length > 0){
        const key = Object.keys(errors[0].constraints)[0]
        throw new ValidationException(errors[0].constraints[key])
    }
        // throw new TypeError(`validation failed. The error fields : ${errors.map(({ property }) => property)}`);
}