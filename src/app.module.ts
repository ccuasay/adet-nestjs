import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PositionsModule } from './positions/positions.module';
import { DatabaseModule } from './database/database.module';
import jwt from './config/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwt],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (jwt) => ({
        secret: jwt.get('jwt.secret'),
        expireIn: jwt.get('jwt.expiresIn'),
        refreshSecret: jwt.get('jwt.refresh'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    PositionsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
