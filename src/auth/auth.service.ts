import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AccessTokenEntity, RefreshTokenEntity } from './entities/token.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AccessTokenEntity)
    private accessTokenRepository: Repository<AccessTokenEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ userId: user.id });
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    await this.accessTokenRepository.save({
      user,
      token: accessToken,
      createdAt: new Date(),
    });
    await this.refreshTokenRepository.save({
      user,
      token: refreshToken,
      createdAt: new Date(),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);
      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });
      const accessToken = this.jwtService.sign({ userId: user.id });

      await this.accessTokenRepository.save({
        user,
        token: accessToken,
        createdAt: new Date(),
      });
      return { accessToken };
    } catch (e) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { id: userId } },
      { isEvoked: true },
    );
  }
}
