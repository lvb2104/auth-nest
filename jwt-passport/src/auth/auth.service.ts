import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  db = [
    {
      id: 1,
      email: 'modane@gmail.com',
      password: '123456',
    },
    {
      id: 2,
      email: 'modadau@gmail.com',
      password: '123456',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(authDto: AuthDto): Promise<any> {
    console.log('Inside AuthService validateUser');
    const user = this.db.find((user) => user.email === authDto.email);
    if (!user) return null;

    if (user.password === authDto.password) {
      //   return { id: user.id, email: user.email };
      return this.jwtService.sign({ sub: user.id });
    }
    return null;
  }

  //   async login(user: any) {
  //     console.log('Inside AuthService login');
  //     const payload = { email: user.email, sub: user.id };
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }
}
