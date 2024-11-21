import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalService } from '../services/Personal/personal/personal.service'; // Importa el servicio de Personal
import * as bcrypt from 'bcryptjs';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly personalService: PersonalService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.personalService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const roleWithPermissions =
        await this.personalService.findRoleWithPermissions(user.id);

      const permissions = roleWithPermissions.role.rolesPermissions.map(
        (rp) => rp.permission,
      );

      return {
        user,
        role: roleWithPermissions.role,
        permissions,
        statusCode: HttpStatus.OK,
        message: `Bienvenido ${user.first_name} ${user.first_last_name}`,
      };
    }
    return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' };
  }

  async login(validatedUser: any) {
    const { user, role, permissions } = validatedUser;
    const payload = {
      userfullname: user.first_name + ' ' + user.first_last_name,
      username: user.email,
      sub: user.id,
      role: role.role_name,
      permissions: permissions.map((permission) => permission.permission_name),
    };
    return {
      statusCode: validatedUser.statusCode,
      message: validatedUser.message,
      access_token: this.jwtService.sign(payload),
    };
  }
}
