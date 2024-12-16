import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from './auth/entities/user.entity';
import {
  AccessTokenEntity,
  RefreshTokenEntity,
} from './auth/entities/token.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '120203',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'vinhpro123',
      signOptions: { expiresIn: '1h' },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    TypeOrmModule.forFeature([
      UserEntity,
      AccessTokenEntity,
      RefreshTokenEntity,
    ]),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
