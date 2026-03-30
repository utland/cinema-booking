export interface TypeOrmMapper<D, O> {
    toDomain(ormEntity: O): D;
    toOrm(domainEntity: D): O;
}