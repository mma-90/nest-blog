import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
// import { PassportModule } from 'passport-jwt';
import { UserService } from './../user/user.service';
import { UserModule } from './../user/user.module';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    // inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET'),
    //     signOptions: { expiresIn: configService.get('JWT_EXPIRE_IN') },
    //   }),
    // }),
    // PassportModule,
    // JwtModule.register({
    //   secret: 'Iamsecret',
    //   signOptions: { expiresIn: '100s' },
    // }),
    JwtModule,
    ConfigModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
