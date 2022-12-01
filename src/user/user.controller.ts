import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Patch,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from './../Interceptor/serialize.interceptor';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from './model/user.entity';
import { Role } from 'src/auth/enum/role.enum';
import { AuthorizedRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from './../auth/guard/jwt.guard';
import { RolesGuard } from './../auth/guard/roles.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    const accessToken = await this.authService.signup(
      body.email.toLowerCase(),
      body.password,
    );
    return { accessToken };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) //apply guards for specific route
  @AuthorizedRoles(Role.Admin, Role.User) //specify allowed roles to access this route
  @Get('list')
  findUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt_strategy_key'))
  @Get('me')
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  findUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
