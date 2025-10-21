import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}
  async create(position_code: string, position_name: string, userId: number) {
    await this.db
      .getPool()
      .execute(
        'INSERT INTO positions (positionCode, positionName, userId) VALUES (?, ?, ?)',
        [position_code, position_name, userId],
      );

    return {
      messsage: 'position created',
      data: { position_code, position_name, userId },
    };
  }

  async findAll() {
    const [rows] = await this.db.getPool().execute('SELECT * FROM positions');

    const data = rows as any[];

    return data;
  }

  async findOne(id: number) {
    const [row] = await this.db
      .getPool()
      .execute('SELECT * FROM positions WHERE id = ?', [id]);

    const task = (row as any[])[0];

    return task;
  }

  async update(
    id: number,
    position_code: string,
    position_name: string,
    userId: number,
  ) {
    const [result] = await this.db
      .getPool()
      .execute(
        'UPDATE positions SET positionCode = ?, positionName = ? WHERE id = ? AND userId = ?',
        [position_code, position_name, id, userId],
      );

    const affectedRows = (result as any).affectedRows;

    return {
      message: 'Position updated successfully',
      data: {
        positionCode: position_code,
        positionName: position_name,
        UserId: userId,
      },
    };
  }

  async remove(id: number) {
    const query = await this.db
      .getPool()
      .execute('DELETE FROM positions WHERE id = ?', [id]);

    const { affectedRows } = query as any;

    return { message: 'Position Deleted', data: affectedRows };
  }
}
