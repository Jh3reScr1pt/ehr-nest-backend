import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    const response = await this.authService.validateUser(
      body.email,
      body.password,
    );
    if (response.statusCode === HttpStatus.UNAUTHORIZED) {
      return { statusCode: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' };
    }
    return this.authService.login(response);
  }
}
