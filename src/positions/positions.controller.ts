import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { AuthGuard } from '../guards/guard';

@UseGuards(AuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(
    @Body('positionCode') positionCode: string,
    @Body('positionName') positionName: string,
    @Req() req: any,
  ) {
    return this.positionsService.create(positionCode, positionName, req.userId);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('positionCode') positionCode: string,
    @Body('positionName') positionName: string,
    @Req() req: any,
  ) {
    return this.positionsService.update(
      +id,
      positionCode,
      positionName,
      req.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
