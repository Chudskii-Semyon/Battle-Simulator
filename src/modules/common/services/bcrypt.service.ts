import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  public async hash(data: any, saltOrRounds: number | string): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  public async genSalt(rounds?: number): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  public async compare(data: any, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
