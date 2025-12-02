import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { TransactionStage } from './types/transaction-stage.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;

  // Mock Mongoose Model
  const mockTransactionModel = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('create', () => {
    it('should create a transaction with breakdown calculated', async () => {
      const dto = {
        propertyId: 'P1',
        listingAgentId: 'A',
        sellingAgentId: 'B',
        totalServiceFee: 1000,
      };

      const mockSave = jest.fn().mockResolvedValue({
        _id: 'tx_123',
        ...dto,
        breakdown: {
          agency: 500,
          agents: { A: 250, B: 250 },
        },
      });

      // Constructor mock oluştur
      const MockConstructor = jest.fn().mockImplementation(() => ({
        save: mockSave,
      }));

      // Service'teki model'i constructor ile değiştir
      (service as any).transactionModel = MockConstructor;

      await service.create(dto);

      // Constructor'ın doğru parametrelerle çağrıldığını doğrula
      expect(MockConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          breakdown: {
            agency: 500,
            agents: { A: 250, B: 250 },
          },
        }),
      );

      expect(mockSave).toHaveBeenCalled();
    });
  });
  describe('findOne', () => {
    it('should return the transaction if found', async () => {
      const mockTx = {
        _id: '1',
        propertyId: 'P1',
        save: jest.fn(),
      };

      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(mockTx);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTx);
    });

    it('should throw NotFoundException if not found', async () => {
      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('x')).rejects.toThrow(
        'Transaction not found',
      );
    });
  });

  // -------------------------------------------------------
  // COMMISSION LOGIC TESTS
  // -------------------------------------------------------
  describe('calculateCommission', () => {
    it('should give full agent portion to one agent if same', () => {
      const result = service.calculateCommission(1000, 'A', 'A');

      expect(result.agency).toBe(500);
      expect(result.agents['A']).toBe(500);
    });

    it('should split agent portion if agents differ', () => {
      const result = service.calculateCommission(1000, 'A', 'B');

      expect(result.agency).toBe(500);
      expect(result.agents['A']).toBe(250);
      expect(result.agents['B']).toBe(250);
    });
  });

  // -------------------------------------------------------
  // STAGE TRANSITION (SOFT VALIDATION)
  // -------------------------------------------------------

  describe('updateStage - non-completed stage', () => {
    it('should NOT recalculate breakdown if stage is NOT completed', async () => {
      const mockTx = {
        _id: '1',
        stage: TransactionStage.EARNEST,
        totalServiceFee: 1000,
        listingAgentId: 'A',
        sellingAgentId: 'B',
        breakdown: { agency: 500, agents: { A: 250, B: 250 } },
        save: jest.fn().mockResolvedValue(true),
      };

      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(mockTx);

      await service.updateStage('1', {
        stage: TransactionStage.TITLE,
      });

      // breakdown MUST remain unchanged
      expect(mockTx.breakdown.agency).toBe(500);
      expect(mockTx.breakdown.agents['A']).toBe(250);
      expect(mockTx.breakdown.agents['B']).toBe(250);
    });
  });

  // Helper to get model token (local utility)
  function moduleRef(service: any) {
    return {
      getModel: () => service['transactionModel'],
    };
  }

  describe('updateStage', () => {
    it('should update stage', async () => {
      const mockTx = {
        _id: '1',
        stage: TransactionStage.EARNEST,
        totalServiceFee: 1000,
        listingAgentId: 'A',
        sellingAgentId: 'A',
        save: jest.fn().mockResolvedValue(true),
      };

      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(mockTx);

      const result = await service.updateStage('1', {
        stage: TransactionStage.TITLE,
      });

      expect(mockTx.stage).toBe(TransactionStage.TITLE);
    });

    it('should recalculate breakdown if stage = completed', async () => {
      const mockTx = {
        _id: '1',
        stage: TransactionStage.TITLE,
        totalServiceFee: 1000,
        listingAgentId: 'A',
        sellingAgentId: 'B',
        save: jest.fn().mockResolvedValue(true),
        breakdown: {
          agency: 0,
          agents: {},
        },
      };

      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(mockTx);

      await service.updateStage('1', {
        stage: TransactionStage.COMPLETED,
      });

      expect(mockTx.breakdown.agency).toBe(500);
      expect(mockTx.breakdown.agents['A']).toBe(250);
      expect(mockTx.breakdown.agents['B']).toBe(250);
    });

    it('should throw if invalid stage transition attempted', async () => {
      const mockTx = {
        _id: '1',
        stage: TransactionStage.AGREEMENT,
        totalServiceFee: 1000,
        listingAgentId: 'A',
        sellingAgentId: 'A',
        save: jest.fn(),
      };

      const model = moduleRef(service).getModel();
      model.findById = jest.fn().mockResolvedValue(mockTx);

      await expect(
        service.updateStage('1', { stage: TransactionStage.COMPLETED }),
      ).rejects.toThrow('Invalid stage transition');
    });
  });
});
