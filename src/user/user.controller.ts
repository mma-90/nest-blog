import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserInterface } from './model/user.interface';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
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
