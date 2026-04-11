import { DomainException } from "src/common/domain/domain-exception/base-exception";
import { Movie } from "./movie.entity";

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
        } catch (err) {
            expect(err).toBeInstanceOf(DomainException);
            expect(err.message).toBe("End time must be greater than start time for movie");
            expect(err.status).toBe(400);
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
        } catch (err) {
            expect(err).toBeInstanceOf(DomainException);
            expect(err.message).toBe("Movie cannot be changed during streaming");
            expect(err.status).toBe(400);
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
        } catch (err) {
            expect(err).toBeInstanceOf(DomainException);
            expect(err.message).toBe("Movie cannot be deleted during streaming");
            expect(err.status).toBe(400);
        }
    });
});
