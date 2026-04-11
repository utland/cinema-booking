import { Exclude } from "class-transformer";
import { Role } from "src/common/enums/role.enum";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from "typeorm";

@Entity("users")
@Index(["login"])
export class User {
    @PrimaryGeneratedColumn("uuid")
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

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];

    @CreateDateColumn()
    createdAt: Date;
}
