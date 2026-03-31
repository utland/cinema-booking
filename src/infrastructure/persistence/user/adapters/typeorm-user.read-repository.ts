import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserReadRepository } from "src/application/user/ports/user.read-repository";
import { UserProfileDto } from "src/application/user/queries/dtos/user-profile.dto";
import { toUserProfileDto } from "../mapper/to-user-profile.mapper";

@Injectable()
export class TypeOrmUserReadRepository implements UserReadRepository {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    public async getProfile(userId: string): Promise<UserProfileDto | null> {
        const sqlRaw = `
        SELECT
            u.id as "userId",
            u.login as "login",
            u.email as "email",
            u.first_name as "firstName",
            u.last_name as "lastName",
            t.id as "ticketId",
            m.title as "movieTitle",
            s.start_time as "showTime",
            se.row_number as "row",
            se.column_number as "column"
        FROM users u
        LEFT JOIN tickets t ON t.user_id = u.id
        LEFT JOIN seats se on se.id = t.seat_id
        LEFT JOIN sessions s on s.id = t.session_id
        LEFT JOIN movies m on m.id = s.movie_id
        WHERE u.id = $1 AND (t.id IS NULL OR s.finish_time > $2)
        `;

        const result = await this.dataSource.query(sqlRaw, [userId, new Date()]);
        if (result.length === 0) return null;

        const dto = toUserProfileDto(result);
        return dto;
    }
    

}