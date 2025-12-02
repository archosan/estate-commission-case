import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID of the property', example: 'property123' })
  @IsString()
  propertyId: string;

  @ApiProperty({ description: 'ID of the listing agent', example: 'agentA' })
  @IsString()
  listingAgentId: string;

  @ApiProperty({ description: 'ID of the selling agent', example: 'agentB' })
  @IsString()
  sellingAgentId: string;

  @ApiProperty({
    description: 'Total service fee for the transaction',
    example: 1500,
  })
  @IsNumber()
  totalServiceFee: number;
}
