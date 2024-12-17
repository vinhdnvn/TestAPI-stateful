import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginDto,
  LogoutAllDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto/auth.dto';

@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('hi')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hi' })
  async hi() {
    return 'hi';
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(body.refreshToken);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiBody({ type: LogoutAllDto })
  @ApiResponse({
    status: 200,
    description: 'Logged out from all devices successfully',
  })
  async logoutAll(@Body() body: LogoutAllDto) {
    return this.authService.logoutAll(body.userId);
  }
}
