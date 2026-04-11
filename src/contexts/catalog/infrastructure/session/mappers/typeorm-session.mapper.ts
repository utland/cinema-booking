import { Injectable } from "@nestjs/common";
import { TypeOrmSession } from "../entities/typeorm-session.entity";
import { EntityMapper } from "src/common/interfaces/entity-mapper";
import { Session } from "src/contexts/catalog/domain/session/models/session.entity";

@Injectable()
export class TypeOrmSessionMapper implements EntityMapper<Session, TypeOrmSession> {
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
