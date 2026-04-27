import { BadRequestDomainException } from "@app/shared-kernel/domain/domain-exceptions/bad-request.exception";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

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
