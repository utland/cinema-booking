export interface EntityMapper<D, O> {
    toDomain(ormEntity: O): D;
    toOrm(domainEntity: D): O;
}
