class TicketInfoDto {
    ticketId: string;
    movieTitle: string;
    showTime: Date;
    row: number;
    column: number;
}

export class UserProfileDto {
    id: string;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    tickets: TicketInfoDto[];
}
