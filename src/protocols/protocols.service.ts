import { Injectable } from '@nestjs/common';
import { SecurityStatusDto, BillingInfoDto, NotificationSettingDto } from './dto/protocols.dto';

@Injectable()
export class ProtocolsService {
  // In-memory store for demo purposes (would be DB in production)
  private notifications: NotificationSettingDto[] = [
    { title: "Forensic Alerts", desc: "Immediate notification of detected capacity leaks.", active: true },
    { title: "Strategic Insights", desc: "Weekly AI-generated market trend analysis.", active: true },
    { title: "Specialist Messages", desc: "Communications from verified network consultants.", active: false },
    { title: "Vault Security", desc: "Alerts for master key rotation and access logs.", active: true },
    { title: "Billing Reports", desc: "Invoices and credit balance notifications.", active: false },
  ];

  async getSecurityStatus(): Promise<SecurityStatusDto> {
    return {
      is2FAEnabled: true,
      passwordStrength: 'High',
      lastLogin: new Date().toISOString(),
      masterKeyActive: true,
    };
  }

  async rotateMasterKey(): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Master Key Rotated Successfully' };
  }

  async getBillingInfo(): Promise<BillingInfoDto> {
    return {
      planName: 'Growth Specialist',
      price: '£499 / Month',
      last4: '•••• •••• •••• 4242',
      expiry: '12/28',
      history: [
        { id: "#INV-902", date: "Jan 01, 2026", amount: "£499.00", status: "Paid" },
        { id: "#INV-841", date: "Dec 01, 2025", amount: "£499.00", status: "Paid" },
        { id: "#INV-720", date: "Nov 01, 2025", amount: "£499.00", status: "Paid" },
      ]
    };
  }

  async getNotifications(): Promise<NotificationSettingDto[]> {
    return this.notifications;
  }

  async updateNotification(title: string, active: boolean): Promise<NotificationSettingDto[]> {
    const setting = this.notifications.find(n => n.title === title);
    if (setting) {
      setting.active = active;
    }
    return this.notifications;
  }

  async purchaseTokens(amount: number, userId: string): Promise<{ balance: number }> {
    // Logic would integrate with UsersService to update DB
    // For now returning mock success
    return { balance: 22 }; 
  }
}
