export const CREDENTIAL_SERVICE_TOKEN = "CredentialService";

export interface CredentialService {
  generate(payload: any, secret?: string | undefined): Promise<string>;
  verify(token: string, secret?: string | undefined): Promise<any>;
}