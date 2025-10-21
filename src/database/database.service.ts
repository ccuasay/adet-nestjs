import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST as string,
      user: process.env.DATABASE_USER as string,
      password: process.env.DATABASE_PASSWORD as string,
      database: process.env.DATABASE_NAME as string,
      port: process.env.DATABASE_PORT as unknown as number,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async onModuleInit() {
    await this.testConnection();
  }

  private async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('Database Successfully Connected');
    } catch (error: any) {
      console.error('Database connection failed:', error);
      throw new Error(`message: ${error.message}`);
    }
  }

  getPool() {
    return this.pool;
  }
}
