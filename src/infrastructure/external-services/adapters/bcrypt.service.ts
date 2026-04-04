import { PasswordService } from "src/application/extrenal-services/ports/password.service";
import bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";

@Injectable()
export class BcryptService implements PasswordService {
    private readonly salt = 10;

    public async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt)
    }
    
    public async compare(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed);
    }

}