import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const error = typeof response === 'string' ? { message: exceptionResponse } : (exceptionResponse as object);

        response.status(status).json({
            statusCode: status,
            ...error,
            timestamp: new Date().toISOString(),
        });
    }
}