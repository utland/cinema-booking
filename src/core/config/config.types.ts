import { TypeOrmModule } from "@nestjs/typeorm";
import { IJwtConfig } from "./jwt.config";
import { IStripeConfig } from "./stripe.config";

export interface ConfigType {
    database: TypeOrmModule;
    jwt: IJwtConfig;
    stripe: IStripeConfig;
}
