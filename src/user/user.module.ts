import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtTokenModule } from '@/jwt-token/jwt-token.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [JwtTokenModule, PrismaModule],
  exports: [],
})
export class UserModule {}
