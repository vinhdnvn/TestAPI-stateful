import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AccessTokenEntity, RefreshTokenEntity } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guard/jwt-auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProtectedController } from './protected.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccessTokenEntity,
      RefreshTokenEntity,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController, ProtectedController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
