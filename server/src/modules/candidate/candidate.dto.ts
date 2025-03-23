import { IsNotEmpty, IsOptional } from "class-validator";

// DTO (Data Transfer Object) for Candidate
export class CandidateDTO {
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;
  @IsOptional() // ✅ Optional because frontend sends the file, not a string
  image!: string; // ✅ Accepts uploaded file
  @IsNotEmpty({ message: "Motto is required" })
  motto!: string;
  @IsNotEmpty({ message: "Election Id is required" })
  electionId!: string;
  @IsOptional()
  voteCount!: number;
}
