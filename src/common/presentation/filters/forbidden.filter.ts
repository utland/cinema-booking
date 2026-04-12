import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { ForbiddenDomainException } from "src/common/domain/domain-exceptions/forbidden.exception";

@Catch(ForbiddenDomainException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenDomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(403).json({
            message: exception.message,
            statusCode: 403,
            error: "BadRequestError"
        });
    }
}
