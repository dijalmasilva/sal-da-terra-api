import { Module } from '@nestjs/common';
import configuration from 'config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from '@/jwt-token/jwt-token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration().auth.secret,
      signOptions: {
        expiresIn: '90d',
      },
      global: true,
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
