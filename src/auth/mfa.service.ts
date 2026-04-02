import { Injectable } from '@nestjs/common';
import { generateSecret, generateURI, verify } from 'otplib';
import { toDataURL } from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MfaService {
  constructor(private readonly configService: ConfigService) {}

  async generateSecret() {
    return generateSecret();
  }

  async generateQrCodeUri(email: string, secret: string) {
    const appName = this.configService.get<string>('APP_NAME') || '247GBS Audit';
    const otpauth = generateURI({
      issuer: appName,
      label: email,
      secret: secret,
    });
    return toDataURL(otpauth);
  }

  async verifyCode(code: string, secret: string): Promise<boolean> {
    const result = await verify({
      token: code,
      secret: secret,
    });
    return result.valid;
  }
}
