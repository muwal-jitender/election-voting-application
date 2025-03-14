import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateIf,
  isEmail,
} from "class-validator";

// DTO (Data Transfer Object) for Voter Registration
export class RegisterVoterDTO {
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsEmail({}, { message: "A valid email address is required" })
  email!: string;

  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;
}
export class SignInDTO {
  @IsEmail({}, { message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
