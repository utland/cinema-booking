import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { NotFoundDomainException } from "src/common/domain/domain-exceptions/not-found.exception";

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
