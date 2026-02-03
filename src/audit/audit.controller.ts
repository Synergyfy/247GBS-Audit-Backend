import { Controller, Get, Param, UseGuards, Req, NotFoundException, Patch, Put, Body, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { AuditService } from './audit.service';
import type { Request } from 'express';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get User Audit History', description: 'Retrieves all audit sessions belonging to the authenticated user.' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of audit sessions.',
    schema: {
      example: [
        {
          id: 'uuid-5678',
          status: 'COMPLETED',
          auditType: 'LONG_FORM',
          sectorId: 'hospitality-food',
          createdAt: '2026-02-03T10:00:00Z',
          calculatedMetrics: { capacityDrainPct: 25, annualRecovery: 12000 }
        }
      ]
    }
  })
  async findAll(@Req() req: Request) {
    const user = (req as any).user;
    return this.auditService.findAllByUser(user.sub);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Audit Session', description: 'Retrieves the current state of an audit session.' })
  @ApiResponse({ 
    status: 200, 
    description: 'Audit session details.',
    schema: {
      example: {
        id: 'uuid-5678',
        status: 'IN_PROGRESS',
        auditType: 'LONG_FORM',
        calculatedMetrics: { capacityDrainPct: 25, totalStockImpact: 15000, annualRecovery: 12000, impactScore: 65 }
      }
    }
  })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    const session = await this.auditService.findOne(id, user.sub);
    if (!session) throw new NotFoundException('Audit session not found');
    return session;
  }

  @Patch(':id/sector')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Select Sector', description: 'Sets the business sector for the audit.' })
  @ApiBody({ schema: { example: { sectorId: 'hospitality-food', groupId: 'dining', businessTypeId: 'fine-dining' } } })
  @ApiResponse({ status: 200, description: 'Sector updated.', schema: { example: { id: 'uuid-5678', status: 'SECTOR_SELECTED', sectorId: 'hospitality-food' } } })
  async updateSector(
    @Param('id') id: string,
    @Body() body: { sectorId: string; groupId: string; businessTypeId: string },
    @Req() req: Request
  ) {
    const user = (req as any).user;
    return this.auditService.updateSector(id, user.sub, body.sectorId, body.groupId, body.businessTypeId);
  }

  @Put(':id/answers')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Submit Answers', description: 'Updates audit answers and triggers real-time recalculation.' })
  @ApiBody({ schema: { example: { "hosp-dining-stock-trigger-01": 25, "stock_value_excess": 5000 } } })
  @ApiResponse({ 
    status: 200, 
    description: 'Answers saved and metrics recalculated.',
    schema: {
      example: {
        calculatedMetrics: { capacityDrainPct: 25, totalStockImpact: 15000, annualRecovery: 12000, impactScore: 65 }
      }
    }
  })
  async updateAnswers(
    @Param('id') id: string,
    @Body() answers: Record<string, any>,
    @Req() req: Request
  ) {
    const user = (req as any).user;
    return this.auditService.updateAnswers(id, user.sub, answers);
  }

  @Post(':id/ai/generate-questions')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate AI Follow-up Questions', description: 'Uses Gemini to generate custom forensic follow-up questions.' })
  @ApiResponse({ status: 201, description: 'Follow-up questions generated.', schema: { example: { followUpQuestions: [{ id: 'q1', text: 'Why?' }] } } })
  async generateFollowUp(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.auditService.generateFollowUp(id, user.sub);
  }

  @Post(':id/ai/generate-insight')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate AI Strategic Insight', description: 'Uses Gemini to generate a personalized strategic pivot and summary.' })
  @ApiResponse({ status: 201, description: 'Insight generated.', schema: { example: { aiInsight: { summary: 'Fix waste', actionablePivot: 'Sell bundles' } } } })
  async generateInsight(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    return this.auditService.generateInsight(id, user.sub);
  }
}
