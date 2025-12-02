import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TransactionStage } from '../types/transaction-stage.enum';

export class UpdateStageDto {
  @ApiProperty({
    description: 'New stage of the transaction',
    enum: TransactionStage,
    enumName: 'TransactionStage',
    examples: [
      TransactionStage.AGREEMENT,
      TransactionStage.EARNEST,
      TransactionStage.TITLE,
      TransactionStage.COMPLETED,
    ],
  })
  @IsEnum(TransactionStage)
  stage: TransactionStage;
}
