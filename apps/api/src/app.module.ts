import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './domain/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
