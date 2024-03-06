import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NodemailerModule } from '@/nodemailer/nodemailer.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtTokenModule } from '@/jwt-token/jwt-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtTokenModule,
    PrismaModule,
    NodemailerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
