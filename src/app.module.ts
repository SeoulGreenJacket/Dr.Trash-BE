import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService, JwtService],
})
export class AppModule {}
