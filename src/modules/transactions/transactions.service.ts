import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { TransactionStage } from './types/transaction-stage.enum';
import { STAGE_FLOW } from './types/allowed-stage-flow';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  private canTransition(
    current: TransactionStage,
    next: TransactionStage,
  ): boolean {
    const currentIndex = STAGE_FLOW.indexOf(current);
    const nextIndex = STAGE_FLOW.indexOf(next);

    // 1 adım ileri veya aynı stage’e geçiş serbest
    return nextIndex === currentIndex + 1 || nextIndex === currentIndex;
  }
  /**
   * Create a new transaction
   */
  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const breakdown = this.calculateCommission(
      dto.totalServiceFee,
      dto.listingAgentId,
      dto.sellingAgentId,
    );

    const created = new this.transactionModel({
      ...dto,
      breakdown, // initial breakdown
    });

    return created.save();
  }

  /**
   * Update transaction stage
   */
  async updateStage(id: string, dto: UpdateStageDto): Promise<Transaction> {
    const tx = await this.transactionModel.findById(id);

    if (!tx) throw new NotFoundException('Transaction not found');

    if (!this.canTransition(tx.stage, dto.stage)) {
      throw new BadRequestException(
        `Invalid stage transition: ${tx.stage} → ${dto.stage} , you can only move to the next stage or remain in the current stage.`,
      );
    }

    // Soft validation (intentionally simple)
    tx.stage = dto.stage;

    // Recalculate breakdown if completed
    if (dto.stage === TransactionStage.COMPLETED) {
      tx.breakdown = this.calculateCommission(
        tx.totalServiceFee,
        tx.listingAgentId,
        tx.sellingAgentId,
      );
    }

    return tx.save();
  }

  async getBreakdown(id: string) {
    const tx = await this.transactionModel.findById(id);

    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.stage !== TransactionStage.COMPLETED) {
      throw new BadRequestException(
        `Breakdown is only available for completed transactions (current: ${tx.stage})`,
      );
    }

    const { breakdown, listingAgentId, sellingAgentId, totalServiceFee } = tx;

    const reasons = {
      [listingAgentId]: 'listing agent',
      ...(sellingAgentId !== listingAgentId && {
        [sellingAgentId]: 'selling agent',
      }),
    };

    return {
      transactionId: tx._id,
      totalFee: totalServiceFee,
      agencyEarning: breakdown.agency,
      agentEarnings: breakdown.agents,
      reasons,
    };
  }

  /**
   * Find a single transaction
   */
  async findOne(id: string): Promise<Transaction> {
    const tx = await this.transactionModel.findById(id);

    if (!tx) throw new NotFoundException('Transaction not found');

    return tx;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async remove(id: string): Promise<Transaction> {
    const tx = await this.transactionModel.findByIdAndDelete(id);

    if (!tx) throw new NotFoundException('Transaction not found');

    return tx;
  }
  async removeAll(): Promise<{ deletedCount?: number }> {
    const result = await this.transactionModel.deleteMany({});
    return { deletedCount: result.deletedCount };
  }

  /**
   * Commission Logic (Core Case Logic)
   */
  calculateCommission(
    totalFee: number,
    listingAgentId: string,
    sellingAgentId: string,
  ) {
    const agencyShare = totalFee * 0.5;
    const agentPortion = totalFee * 0.5;

    // Scenario 1: same agent
    if (listingAgentId === sellingAgentId) {
      return {
        agency: agencyShare,
        agents: {
          [listingAgentId]: agentPortion,
        },
      };
    }

    // Scenario 2: two different agents
    const each = agentPortion / 2;

    return {
      agency: agencyShare,
      agents: {
        [listingAgentId]: each,
        [sellingAgentId]: each,
      },
    };
  }
}
