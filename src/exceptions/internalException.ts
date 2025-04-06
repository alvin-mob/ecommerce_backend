import { ErrorCode, HttpException } from "./root";

export class InternalException extends HttpException{
    
    constructor(message: string, errors: any){
        super(message,  ErrorCode.INTERNAL_EXCEPTION, 400, errors);
    }
}