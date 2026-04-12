import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";

@Catch(BadRequestDomainException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(400).json({
            message: exception.message,
            statusCode: 400,
            error: "BadRequestError"
        });
    }
}
