import {
  Controller,
  Body,
  Post,
  Patch,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(username, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @UseGuards(AuthGuard)
  @Post('user')
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async findAll() {
    return this.authService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async findOne(@Param('id') id: number) {
    return this.authService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number) {
    return this.authService.delete(id);
  }

  @Patch('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.update(id, username, password);
  }
}
