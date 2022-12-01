import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt_strategy_key') {
  constructor() {
    super();
  }
}

/* this is only clean way to call guard by calling: 
    @UseGuards(JwtAuthGuard) 
   instead of 
    @UseGuards(AuthGuard('jwt_strategy_key'))
*/
