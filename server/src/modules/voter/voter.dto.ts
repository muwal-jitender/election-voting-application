import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from "class-validator";

// DTO (Data Transfer Object) for Voter Registration
export class RegisterVoterDTO {
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsEmail({}, { message: "A valid email address is required" })
  email!: string;

  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  @Matches(/[\W_]/, {
    message: "Password must contain at least one special character",
  })
  password!: string;
}
export class SignInDTO {
  @IsEmail({}, { message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

export class EnableTwoFactorDTO {
  @IsString()
  @Length(6, 6, { message: "Code must be exactly 6 digits" })
  code!: string;

  @IsString()
  secret!: string; // TOTP base32 string from frontend
}

export class UpdateTwoFactorSettingsDTO {
  @IsString()
  totpSecret!: string;

  @IsBoolean()
  is2FAEnabled!: boolean;
}
