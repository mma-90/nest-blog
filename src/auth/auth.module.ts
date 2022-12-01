import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from './../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), ConfigModule, forwardRef(() => UserModule)],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

/*


because AuthModule depend on UserModule and
UserModule depend on AuthModule this cause problem called circular dependencies 

Nest fix it by add
To Modules: 
forwardRef(() => UserModule) in AuthModule imports
forwardRef(() => AuthModule) in UserModule imports

To Services: 

UserModule : 
constructor(
    ...
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
)

AuthModule : 
constructor(
    ...
    @Inject(forwardRef(() =>UserService))
    private userService:UserService,
)
*/
