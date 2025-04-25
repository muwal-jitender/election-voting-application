// DTO (Data Transfer Object) for Refresh Token
export class RefreshTokenDTO {
  refreshToken!: string;
  userId!: string;
  ipAddress?: string;
  userAgent?: string;
  isRevoked!: boolean;
  expiresAt!: Date;
}
