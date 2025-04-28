import { ErrorCode, HttpException } from "./root";

export class UnauthorizedException extends HttpException{
    constructor(message: string, errors: any){
        super(message, ErrorCode.UNAUTHORIZED_EXCEPTION, 401, errors)
    }
}