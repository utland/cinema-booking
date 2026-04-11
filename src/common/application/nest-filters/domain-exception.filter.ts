import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { DomainException } from "src/common/domain/domain-exception/base-exception";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(exception.status).json({
            message: exception.message,
            statusCode: exception.status,
            error: "Error in domain layer"
        });
    }
}
