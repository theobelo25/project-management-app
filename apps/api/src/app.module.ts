import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UsersModule } from './domain/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { validateEnv, AppConfigModule } from './config';
import { LoggerModule } from './logger/logger.module';
import { ProjectsModule } from './domain/projects/projects.module';
import { TasksModule } from './domain/tasks/tasks.module';
import { OrganizationsModule } from './domain/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env'],
    }),
    AppConfigModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    LoggerModule,
    ProjectsModule,
    TasksModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
