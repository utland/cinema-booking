import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class PasswordService {
    private readonly salt = 15;

    public async encrypt(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt);
    }

    public async isEqual(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }
}
