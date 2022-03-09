import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ErrorResponseDto } from "../dto/response/error-response.dto";
import { ResponseDto } from "../dto/response/response.dto";
import { ErrorData } from "../exception/error-data";

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto> {
        return next.handle().pipe(
            map((data) => {
                const ctx = context.switchToHttp();
                const res = ctx.getResponse<Response>();
                if (data instanceof ResponseDto) {
                    data.statusCode = res.statusCode;
                }
                return data;
            }),
        );
    }
}
