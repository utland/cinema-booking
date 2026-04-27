import { NotFoundDomainException } from "@app/shared-kernel/domain/domain-exceptions/not-found.exception";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch(NotFoundDomainException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(404).json({
            message: exception.message,
            statusCode: 404,
            error: "NotFoundError"
        });
    }
}
