import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service.interface';
import { argon2id, hash, Options, verify } from 'argon2';

const ARGON2_OPTIONS: Options = {
  type: argon2id,
};

@Injectable()
export class Argon2Service implements HashingService {
  async hash(data: string): Promise<string> {
    return hash(data, ARGON2_OPTIONS);
  }
  
  verify(plainText: string, hashed: string): Promise<boolean> {
    return verify(hashed, plainText);
  }
}
