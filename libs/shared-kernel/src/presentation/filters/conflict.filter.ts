import { ConflictDomainException } from "@app/shared-kernel/domain/domain-exceptions/conflict.exception";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch(ConflictDomainException)
export class ConflictExceptionFilter implements ExceptionFilter {
    catch(exception: ConflictDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(409).json({
            message: exception.message,
            statusCode: 409,
            error: "ConflictError"
        });
    }
}
