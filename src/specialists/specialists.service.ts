import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from './entities/specialist.entity';
import { SpecialistDto, SpecialistStatsDto } from './dto/specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
  ) {}

  async findAll(): Promise<Specialist[]> {
    const specialists = await this.specialistRepository.find();
    if (specialists.length === 0) {
        // Return seed data if DB is empty for demo/init
        return [
            {
                id: '1',
                name: "Dr. Elena Vance",
                role: "Forensic Operations Auditor",
                rating: 4.9,
                reviews: 124,
                expertise: ["Hospitality", "Logistics"],
                status: "Available",
                experience: "15+ Years",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
            },
            {
                id: '2',
                name: "Marcus Thorne",
                role: "Supply Chain Optimization",
                rating: 5.0,
                reviews: 89,
                expertise: ["Manufacturing", "Retail"],
                status: "In Call",
                experience: "12 Years",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
            },
            {
                id: '3',
                name: "Sarah Jenkins",
                role: "Financial Efficiency Expert",
                rating: 4.8,
                reviews: 215,
                expertise: ["FinTech", "Service Industry"],
                status: "Available",
                experience: "18 Years",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            },
            {
                id: '4',
                name: "Julian Voss",
                role: "Strategic Resource Planner",
                rating: 4.9,
                reviews: 56,
                expertise: ["Energy", "Infrastructure"],
                status: "Out of Office",
                experience: "10 Years",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian"
            }
        ] as any;
    }
    return specialists;
  }

  async getStats(): Promise<SpecialistStatsDto> {
    return {
      verifiedExperts: "480+",
      successfulDeployments: "12.4k",
      globalReach: "45 Countries",
      avgResponseTime: "4 mins",
    };
  }
}
