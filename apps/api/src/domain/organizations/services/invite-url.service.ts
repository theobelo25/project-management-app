import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InviteUrlService {
  constructor(private readonly configService: ConfigService) {}

  buildInviteUrl(token: string): string {
    const frontendOrigin =
      this.configService.getOrThrow<string>('app.frontendOrigin');

    return `${frontendOrigin}/invite?token=${encodeURIComponent(token)}`;
  }
}
