export interface DomainFactory<T> {
    create(...args: any[]): Promise<T>;
}