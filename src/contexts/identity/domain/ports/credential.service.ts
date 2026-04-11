import { Payload } from "src/common/interfaces/payload.i";

export const CREDENTIAL_SERVICE_TOKEN = "CredentialService";

export interface CredentialService {
    generate(payload: Payload): Promise<string>;
    verify(token: string): Promise<Payload>;
}
