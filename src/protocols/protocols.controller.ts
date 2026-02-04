import { Controller, Get, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ProtocolsService } from './protocols.service';
import { SecurityStatusDto, BillingInfoDto, NotificationSettingDto, UpdateNotificationDto } from './dto/protocols.dto';
import type { Request } from 'express';

@ApiTags('Protocols')
@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Get('security')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Security Status', description: 'Returns 2FA status and key info.' })
  @ApiResponse({ status: 200, type: SecurityStatusDto })
  async getSecurity() {
    return this.protocolsService.getSecurityStatus();
  }

  @Post('security/rotate-key')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Rotate Master Key', description: 'Rotates the vault encryption key.' })
  async rotateKey() {
    return this.protocolsService.rotateMasterKey();
  }

  @Get('billing')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Billing Info', description: 'Returns subscription and invoice history.' })
  @ApiResponse({ status: 200, type: BillingInfoDto })
  async getBilling() {
    return this.protocolsService.getBillingInfo();
  }

  @Get('notifications')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Notification Settings', description: 'Returns user notification preferences.' })
  @ApiResponse({ status: 200, type: [NotificationSettingDto] })
  async getNotifications() {
    return this.protocolsService.getNotifications();
  }

  @Patch('notifications')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update Notification', description: 'Toggles a notification setting.' })
  async updateNotification(@Body() dto: UpdateNotificationDto) {
    return this.protocolsService.updateNotification(dto.title, dto.active);
  }

  @Post('tokens/purchase')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Purchase Tokens', description: 'Adds tokens to the user account.' })
  async purchaseTokens(@Req() req: Request) {
    const user = (req as any).user;
    return this.protocolsService.purchaseTokens(10, user.sub);
  }
}
