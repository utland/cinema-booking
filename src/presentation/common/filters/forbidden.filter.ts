import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";
import { ForbiddenDomainException } from "src/domain/common/exceptions/forbidden.exception";

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
