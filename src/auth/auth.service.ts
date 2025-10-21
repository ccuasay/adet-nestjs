import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const [rows] = (await this.db
      .getPool()
      .execute('SELECT * FROM users WHERE username = ?', [username])) as any[];

    if (rows.length === 0) {
      throw new BadRequestException('Invalid Credentials');
    }

    const user = rows[0];
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log(user, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = { userId: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.db
      .getPool()
      .execute('UPDATE users SET refreshToken = ? WHERE id = ?', [
        hashedRT,
        user.id,
      ]);
    return { accessToken, refreshToken };
  }

  async signup(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(username, password);
    await this.db
      .getPool()
      .execute('INSERT INTO users (username, password) VALUES(?, ?)', [
        username,
        hashedPassword,
      ]);

    return {
      message: 'Succesfuly created',
      data: { username, hashedPassword },
    };
  }

  async getAll() {
    const [rows] = await this.db.getPool().execute('SELECT * FROM users');
    const data = rows as any[];
    if (data.length === 0) {
      throw new BadRequestException('No Data found');
    }

    return data;
  }

  async getOne(id: number) {
    const [rows] = await this.db
      .getPool()
      .execute('SELECT * FROM users WHERE id = ?', [id]);
    const data = rows as any[];
    if (data.length === 0) {
      throw new BadRequestException('No Data found');
    }

    return data;
  }

  async delete(id: number) {
    const [rows] = await this.db
      .getPool()
      .execute('DELETE FROM users WHERE id = ?', [id]);

    const { affectedRows } = rows as any;

    if (affectedRows === 0) {
      throw new BadRequestException('User not found');
    }

    return { message: 'succesfully deleted user' };
  }

  async update(id: string, username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await this.db
      .getPool()
      .execute('UPDATE users SET username = ?, password = ? WHERE id = ? ', [
        username,
        hashedPassword,
        id,
      ]);

    const { affectedRows } = rows as any;

    if (affectedRows === 0) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'User Updated succesfully',
      data: { username, hashedPassword },
    };
  }
}
