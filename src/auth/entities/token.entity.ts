import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('access_tokens')
export class AccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.accessTokens)
  user: UserEntity;

  @Column()
  token: string;

  @Column()
  createdAt: Date;
}

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  user: UserEntity;

  @Column()
  token: string;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isEvoked: boolean;
}
