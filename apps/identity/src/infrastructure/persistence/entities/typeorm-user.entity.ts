import { Role } from "@app/shared-kernel/domain/enums/user-role.enum";
import { Exclude } from "class-transformer";
import { Entity, Column, OneToMany, Index, PrimaryColumn } from "typeorm";

@Entity("users")
@Index(["login"])
export class TypeOrmUser {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    login: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role;

    @Column({ type: "date", name: "created_at" })
    createdAt: Date;
}
