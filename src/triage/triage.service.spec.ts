import { Test, TestingModule } from '@nestjs/testing';
import { TriageService } from './triage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditTriage, TriageDecision, AuditType } from './entities/triage.entity';
import { AuditService } from '../audit/audit.service';
import { CreateTriageDto } from './dto/create-triage.dto';

describe('TriageService', () => {
  let service: TriageService;
  let mockTriageRepository;
  let mockAuditService;

  beforeEach(async () => {
    mockTriageRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((triage) => Promise.resolve({ id: 'triage-uuid', ...triage })),
    };

    mockAuditService = {
      createFromTriage: jest.fn().mockResolvedValue({ id: 'session-uuid' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriageService,
        {
          provide: getRepositoryToken(AuditTriage),
          useValue: mockTriageRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<TriageService>(TriageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDecision', () => {
    // Access private method via casting to any for testing logic directly
    const calculateDecision = (dto: CreateTriageDto) => (service as any).calculateDecision(dto);

    it('should return CRITICAL if stock extent >= 31', () => {
      const result = calculateDecision({ stockExtent: 31 } as any);
      expect(result).toEqual({ decision: TriageDecision.CRITICAL, auditType: AuditType.LONG_FORM });
    });

    it('should return CRITICAL if stock >= 16 AND impact is serious', () => {
      const result = calculateDecision({ stockExtent: 16, stockImpact: 'serious' } as any);
      expect(result).toEqual({ decision: TriageDecision.CRITICAL, auditType: AuditType.LONG_FORM });
    });

    it('should return FULL_AUDIT if capacity >= 16', () => {
      const result = calculateDecision({ capacityExtent: 20 } as any);
      expect(result).toEqual({ decision: TriageDecision.FULL_AUDIT, auditType: AuditType.LONG_FORM });
    });

    it('should return PARTIAL_AUDIT if stock >= 7', () => {
      const result = calculateDecision({ stockExtent: 10 } as any);
      expect(result).toEqual({ decision: TriageDecision.PARTIAL_AUDIT, auditType: AuditType.SHORT_FORM });
    });

    it('should return NO_AUDIT if thresholds are low', () => {
      const result = calculateDecision({ stockExtent: 5, capacityExtent: 5 } as any);
      expect(result).toEqual({ decision: TriageDecision.NO_AUDIT, auditType: AuditType.NONE });
    });
  });
});
