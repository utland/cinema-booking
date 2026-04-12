import { Movie } from "./movie.entity";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";

describe("Movie Test", () => {
    it("should throw exception when start date is after end date", () => {
        try {
            const movie = new Movie(
                "Inception",
                125,
                "A mind-bending thriller",
                "Sci-Fi",
                new Date("2023-01-02"),
                new Date("2023-01-01")
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("End time must be greater than start time for movie");
        }
    });

    it("should throw exception when trying to update info during streaming", () => {
        try {
            const movie = new Movie(
                "Inception",
                125,
                "A mind-bending thriller",
                "Sci-Fi",
                new Date(Date.now() - 1000),
                new Date(Date.now() + 1000)
            );

            movie.updateInfo("New Title", "New Description", 130, "Action");
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("Movie cannot be changed during streaming");
        }
    });

    it("should throw exception when trying to delete movie during streaming", () => {
        try {
            const movie = new Movie(
                "Inception",
                125,
                "A mind-bending thriller",
                "Sci-Fi",
                new Date(Date.now() - 1000),
                new Date(Date.now() + 1000)
            );

            movie.validateDeleteOperation();
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("Movie cannot be deleted during streaming");
        }
    });
});
