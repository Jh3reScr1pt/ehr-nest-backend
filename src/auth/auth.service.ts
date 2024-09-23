import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalService } from '../personal/personal.service'; // Importa el servicio de Personal
import * as bcrypt from 'bcryptjs';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly personalService: PersonalService, // Inyecta el servicio de personal
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.personalService.findByEmail(email); // Usa el método findByEmail

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        user,
        statusCode: HttpStatus.OK,
        message: `Bienvenido ${user.first_name}`,
      }; // Devuelve el mensaje de bienvenida
    }

    return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' };
  }

  async login(validatedUser: any) {
    const { user } = validatedUser;
    const payload = { username: user.email, sub: user.id };
    return {
      statusCode: validatedUser.statusCode,
      message: validatedUser.message,
      access_token: this.jwtService.sign(payload), // Genera el JWT
    };
  }
}
