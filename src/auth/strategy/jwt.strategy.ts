import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/*
Strategy
It is a way to define custom algorithm/logic to authenticate users. 
Passport has a lot of strategies like JWT, facebook, google and more.. 
You extend a strategy and add your custom logic like from where to get the user.

*/

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt_strategy_key',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log(payload);
    // i can change what I want to be returned
    return payload; //return added to express request (req.user)
  }
}
