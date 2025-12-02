import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.service.create(dto);
  }

  @ApiBadRequestResponse({
    description: 'Invalid stage transition or invalid input data',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  @Patch(':id/stage')
  updateStage(@Param('id') id: string, @Body() dto: UpdateStageDto) {
    return this.service.updateStage(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Delete()
  removeAll() {
    return this.service.removeAll();
  }

  @Get(':id/breakdown')
  @ApiOkResponse({ description: 'Commission breakdown for this transaction' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  getBreakdown(@Param('id') id: string) {
    return this.service.getBreakdown(id);
  }
}
