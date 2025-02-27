import { IsNotEmpty, IsOptional, isEmpty } from "class-validator";

// DTO (Data Transfer Object) for Candidate
export class CandidateDTO {
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;
  @IsOptional() // ✅ Optional because frontend sends the file, not a string
  image!: string; // ✅ Accepts uploaded file
  @IsNotEmpty({ message: "Full name is required" })
  motto!: string;
  @IsNotEmpty({ message: "Election-id is required" })
  electionId!: string;
  @IsOptional()
  voteCount!: number;
}
