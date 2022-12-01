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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from './../Interceptor/serialize.interceptor';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from './model/user.entity';

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
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('list')
  findUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt_strategy_key'))
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
