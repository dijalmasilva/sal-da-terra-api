import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  sign(payload: any) {
    return this.jwtService.sign(payload);
  }

  verify<T extends object>(token: string) {
    return this.jwtService.verify<T>(token);
  }
}
