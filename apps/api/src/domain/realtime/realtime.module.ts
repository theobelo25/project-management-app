import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule, getAccessJwtOptions } from '@api/config';
import { AuthModule } from '@api/domain/auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimePublisher } from './realtime.publisher';
import { ProjectsPersistenceModule } from '@api/domain/projects/projects-persistence.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    ProjectsPersistenceModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getAccessJwtOptions(configService).jwtModuleOptions;
      },
    }),
  ],
  providers: [RealtimeGateway, RealtimePublisher],
  exports: [RealtimeGateway, RealtimePublisher],
})
export class RealtimeModule {}
