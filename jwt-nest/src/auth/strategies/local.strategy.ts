import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    console.log('Inside LocalStrategy');
    const token = await this.authService.validateUser({
      email,
      password,
    });
    if (!token) {
      throw new UnauthorizedException('what the hell?');
    }
    // return user to be used in the request object in the controller method that uses this strategy to authenticate the user and generate a token
    return token;
  }
}
