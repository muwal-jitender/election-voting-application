import { IsNotEmpty, IsOptional } from "class-validator";

// DTO (Data Transfer Object) for Election
export class ElectionDTO {
  @IsNotEmpty({ message: "Full name is required" })
  title!: string;
  @IsNotEmpty({ message: "Description is required" })
  description!: string;
  @IsOptional() // ✅ Optional because frontend sends the file, not a string
  thumbnail!: string; // ✅ Accepts uploaded file
}
