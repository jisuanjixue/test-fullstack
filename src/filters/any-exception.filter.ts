import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, ConflictException } from '@nestjs/common';

@Catch()
export class AnyExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: exception.errors,
      error: exception.message && exception.message.error
    });
  }
}