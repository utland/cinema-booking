import { UserProfileDto } from "@app/identity/application/queries/dtos/user-profile.dto";

export const toUserProfileDto = (result: any[]): UserProfileDto => {
    const user = result[0];
    return {
        id: user.userId,
        login: user.login,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tickets:
            result.length === 0
                ? []
                : result.map((item) => {
                      return {
                          ticketId: item.ticketId,
                          movieTitle: item.movieTitle,
                          showTime: item.showTime,
                          row: item.row,
                          column: item.column
                      };
                  })
    };
};
