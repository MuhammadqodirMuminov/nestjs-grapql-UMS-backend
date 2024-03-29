import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/users/models/user.model';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response?: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id,
    };

    const expires = new Date();

    expires.setSeconds(
      expires.getSeconds() + +this.configService.get<string>('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    if (response) {
      response.cookie('Authentication', token, {
        httpOnly: true,
        expires,
      });
    }

    return token;
  }

  async logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
