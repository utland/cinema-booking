export abstract class BaseDomainException extends Error { 
    constructor(message: string) {
        super(message);
    }
}
