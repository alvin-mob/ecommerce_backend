import { ErrorCode, HttpException } from "./root";

export class UnprocessabilityException extends HttpException{

    constructor(message:string, errors: any){
        super(message, ErrorCode.UNPROCESSIBLE_ENTITY, 422, errors);
    }
}