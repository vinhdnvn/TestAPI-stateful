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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('PROTECTED')
@ApiBearerAuth()
@Controller('protected')
export class ProtectedController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the profile of the currently authenticated user.',
  })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @ApiOperation({
    summary: 'Logout all devices',
    description: 'Logout user from all devices by clearing all refresh tokens.',
  })
  @ApiBody({
    description: 'Payload containing user ID',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '12345' },
      },
    },
  })
  async logoutAll(@Body() body: { userId: string }) {
    return this.authService.logoutAll(body.userId);
  }
}
