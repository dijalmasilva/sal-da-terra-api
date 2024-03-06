import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { add, isBefore } from 'date-fns';
import UserSignIn from '@/auth/dto/user-sign-in';
import { NodemailerService } from '@/nodemailer/nodemailer.service';
import { JwtTokenService } from '@/jwt-token/jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private nodemailerService: NodemailerService,
    private jwtService: JwtTokenService,
  ) {}

  async signIn(user: UserSignIn): Promise<any> {
    // generate a random number with 6 digits
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const expireCode = add(new Date(), { minutes: 5 });

    const userUpdate = await this.prismaService.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
      },
    });

    await this.prismaService.userRoles.upsert({
      where: {
        user_id_role_id: {
          user_id: userUpdate.id,
          role_id: 1,
        },
      },
      update: {},
      create: {
        user_id: userUpdate.id,
        role_id: 1,
      },
    });

    const authFound = await this.prismaService.auth.findUnique({
      where: { email: user.email },
    });

    let auth;

    if (!authFound) {
      auth = await this.prismaService.auth.create({
        data: {
          email: user.email,
          code: `${randomNumber}`,
          expire_code: expireCode,
        },
      });
    } else {
      if (
        !authFound.expire_code ||
        (authFound.expire_code && isBefore(authFound.expire_code, new Date()))
      ) {
        console.log('expired');
        auth = await this.prismaService.auth.update({
          where: { email: user.email },
          data: {
            code: `${randomNumber}`,
            expire_code: expireCode,
            token: '',
          },
        });
      } else {
        console.log('not expired');
        auth = authFound;
      }
    }

    if (auth && auth.code) {
      console.dir(auth);
      await this.nodemailerService.sendEmail(user.email, auth.code);
      return {
        message: `Code ${auth.code} sent to your email`,
      };
    }

    return {
      message: 'Error to send code',
    };
  }

  async verifyCode(email: string, code: string): Promise<any> {
    const auth = await this.prismaService.auth.findUnique({
      where: { email },
    });

    if (auth && auth.code === code) {
      console.log('code is equal');
      if (auth.expire_code && !isBefore(auth.expire_code, new Date())) {
        const userId = await this.prismaService.user.findFirst({
          where: {
            email: email,
          },
          select: {
            id: true,
          },
        });

        const userRoles = await this.prismaService.userRoles.findMany({
          where: {
            user_id: userId?.id,
          },
          select: {
            role: {
              select: {
                name: true,
              },
            },
            user: true,
          },
        });

        const roles = userRoles.map((role) => {
          return role.role.name;
        });

        const userResult = {
          ...userRoles[0].user,
          roles,
        };

        const token = this.jwtService.sign(userResult ?? {});
        console.log(token);
        await this.prismaService.auth.update({
          where: {
            email: email,
          },
          data: {
            code: '',
            last_sign_in: new Date(),
            token,
            expire_code: null,
          },
        });

        return {
          message: 'Code verified and sent to your email',
          token,
        };
      } else {
        console.log('expired');
      }
    }

    return {
      message: 'Code not verified',
    };
  }

  async singOut(email: string): Promise<void> {
    await this.prismaService.auth.update({
      where: {
        email,
      },
      data: {
        code: '',
        token: '',
        last_sign_in: new Date(),
        expire_code: null,
      },
    });
  }

  async updateLastSignIn(email: string): Promise<void> {
    await this.prismaService.auth.update({
      where: { email },
      data: {
        last_sign_in: new Date(),
      },
    });
  }
}
