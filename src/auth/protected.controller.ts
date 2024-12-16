import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth';
import { AuthService } from './auth.service';
// Import JwtAuthGuard

@Controller('protected')
export class ProtectedController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  //   logout all
  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Body() body: { userId: string }) {
    return this.authService.logoutAll(body.userId);
  }
}
