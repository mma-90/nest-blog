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
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UpdateUserRoleDto,
} from './dtos';
import { Serialize } from './../Interceptor/serialize.interceptor';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from './model/user.entity';
import { Role } from '../auth/enum/role.enum';
import { HasRoles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from './../auth/guard/jwt.guard';
import { RolesGuard } from './../auth/guard/roles.guard';

@Controller('user')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // @Post('signup')
  // async signUp(@Body() body: CreateUserDto) {
  //   const accessToken = await this.authService.signup(
  //     body.email.toLowerCase(),
  //     body.password,
  //   );
  //   return { accessToken };
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) //apply guards for specific route
  @HasRoles(Role.Admin) //specify allowed roles to access this route
  @Get('list')
  findUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    // return this.userService.findAll();
    return this.userService.paginate({
      page,
      limit,
      route: 'http://localhost:3000/user/list',
    });
  }

  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt_strategy_key'))
  @Get('me')
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.Admin)
  @Patch(':id/role')
  updateUserRole(@Param('id') id: number, @Body() body: UpdateUserRoleDto) {
    return this.userService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @HasRoles(Role.Admin)
  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
