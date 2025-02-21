import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

// DTO (Data Transfer Object) for Voter Registration
export class RegisterVoterDTO {
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters ong" })
  password!: string;
}
export class SignInDTO {
  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
