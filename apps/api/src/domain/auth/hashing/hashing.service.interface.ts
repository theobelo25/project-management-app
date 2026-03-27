export const HASHING_SERVICE = Symbol('HASHING_SERVICE');

export abstract class HashingService {
  abstract hash(data: string): Promise<string>;
  abstract verify(plaintext: string, hashed: string): Promise<boolean>;
}
