import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AccessTokenEntity, RefreshTokenEntity } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/jwt-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccessTokenEntity,
      RefreshTokenEntity,
    ]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
