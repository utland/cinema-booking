import { Injectable } from "@nestjs/common";
import { Session } from "src/domain/session/models/session.entity";
import { TypeOrmMapper } from "src/infrastructure/common/interfaces/typeorm-mapper.i";
import { TypeOrmSession } from "../entities/typeorm-session.entity";

@Injectable()
export class TypeOrmSessionMapper implements TypeOrmMapper<Session, TypeOrmSession> {
    toDomain(ormEntity: TypeOrmSession): Session {
        return new Session(
            ormEntity.movieId,
            ormEntity.hallId,
            ormEntity.basePrice,
            ormEntity.startTime,
            ormEntity.finishTime,
            ormEntity.id
        );
    }

    toOrm(domainEntity: Session): TypeOrmSession {
        const ormSession = new TypeOrmSession();

        ormSession.id = domainEntity.id;
        ormSession.movieId = domainEntity.movieId;
        ormSession.hallId = domainEntity.hallId;
        ormSession.basePrice = domainEntity.basePrice;
        ormSession.startTime = domainEntity.timePeriod.startTime;
        ormSession.finishTime = domainEntity.timePeriod.endTime;

        return ormSession;
    }
}
