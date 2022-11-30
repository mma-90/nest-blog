import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from './../Interceptor/serialize.interceptor';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    const accessToken = await this.userService.signup(
      body.email.toLowerCase(),
      body.password,
    );
    return { accessToken };
  }

  @Post('login')
  login(@Body() body: CreateUserDto) {
    return this.userService.login(body.email, body.password);
  }

  @Get('list')
  findUsers() {
    return this.userService.findAll();
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
