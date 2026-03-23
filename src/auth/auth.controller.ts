import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UseRoleGuard } from './guards/use-role/use-role.guard';
import { RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    console.log({ rawHeaders });
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      email,
      rawHeaders,
    };
  }
  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UseRoleGuard)
  testingPrivate2Route(
    //@Req() request: Express.Request
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivate3Route(
    //@Req() request: Express.Request
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    };
  }
}
