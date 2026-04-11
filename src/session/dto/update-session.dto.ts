import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateSessionDto } from "./create-session.dto";

export class UpdateSessionDto extends OmitType(CreateSessionDto, ["movieId"] as const) {}
