import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Para obtener la clave secreta desde las variables de entorno

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Usa la clave secreta para validar
    });
  }

  async validate(payload: any) {
    return {
      userfullname: payload.userfullname,
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      permissions: payload.permissions,
    }; // El payload contiene los datos del usuario
  }
}
