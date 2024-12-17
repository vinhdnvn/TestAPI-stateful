import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/token.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      // Verify token and get decoded payload
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      // Check refresh token has been evoked
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { token },
      });

      if (refreshToken && refreshToken.isEvoked) {
        throw new UnauthorizedException('This refresh token has been revoked');
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
