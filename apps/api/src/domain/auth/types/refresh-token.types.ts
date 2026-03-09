export type RefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  tokenPrefix: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
  replacedByTokenId: string | null;
};

export type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  tokenPrefix: string;
  expiresAt: Date;
};

export type ConsumeAndReplaceRefreshTokenInput = {
  currentId: string;
  replacedByTokenId: string;
  now: Date;
};
