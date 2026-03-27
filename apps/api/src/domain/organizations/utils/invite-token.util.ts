import * as crypto from 'node:crypto';

const TOKEN_BYTES = 32;

export function generateInviteToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString('base64url');
}

export function inviteTokenPrefix(token: string): string {
  return token.slice(0, 8);
}

export function inviteTokenHash(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
