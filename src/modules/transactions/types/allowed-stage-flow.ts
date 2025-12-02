import { TransactionStage } from './transaction-stage.enum';

export const STAGE_FLOW: TransactionStage[] = [
  TransactionStage.AGREEMENT,
  TransactionStage.EARNEST,
  TransactionStage.TITLE,
  TransactionStage.COMPLETED,
];
