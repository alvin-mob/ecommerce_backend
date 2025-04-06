import { ErrorCode, HttpException } from "./root";

export class NotFoundException extends HttpException{
  constructor(message: string, errors: any){
    super(message, ErrorCode.USER_NOT_FOUND, 404, errors)
  }
}