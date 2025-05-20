import crypto from "crypto";
import { env } from "./env-config.utils";

const ENCRYPTION_KEY_HEX = env.TOTP_SECRET_KEY!;

// ✅ Convert hex string to 32-byte Buffer
if (ENCRYPTION_KEY_HEX.length !== 64) {
  throw new Error("TOTP_SECRET_KEY must be a 64-character hex string.");
}
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, "hex");

const IV_LENGTH = 16;

export const encryptionService = {
  encrypt: (text: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  },

  decrypt: (text: string): string => {
    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },
};
