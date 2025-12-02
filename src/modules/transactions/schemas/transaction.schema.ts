import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TransactionStage } from '../types/transaction-stage.enum';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  propertyId: string;

  @Prop({ required: true })
  listingAgentId: string;

  @Prop({ required: true })
  sellingAgentId: string;

  @Prop({ required: true })
  totalServiceFee: number;

  @Prop({
    enum: TransactionStage,
    default: TransactionStage.AGREEMENT,
  })
  stage: TransactionStage;

  @Prop({ type: Object })
  breakdown: any;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
