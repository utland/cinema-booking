import { PickType } from "@nestjs/swagger";
import { CreateSessionReqDto } from "./create-session.request.dto";

export class UpdateSessionReqDto extends PickType(CreateSessionReqDto, ["startTime", "finishTime", "bookingTime", "basePrice"] as const) {}
