export class HttpException extends Error{
    errorCode : ErrorCode;
    statusCode : number;
    errors : any

    constructor(message: string,  errorCode: ErrorCode, statusCode:number, errors : any){
        super(message);
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.errors = errors
    }
}

export enum ErrorCode{
    USER_NOT_FOUND = 1001,
    USESR_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSIBLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 2003,
    UNAUTHORIZED_EXCEPTION = 2004
}