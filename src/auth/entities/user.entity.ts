import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AccessTokenEntity, RefreshTokenEntity } from './token.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @OneToMany(() => AccessTokenEntity, (token) => token.user)
  accessTokens: AccessTokenEntity[];

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens: RefreshTokenEntity[];
}
