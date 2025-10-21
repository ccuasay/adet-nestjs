import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
