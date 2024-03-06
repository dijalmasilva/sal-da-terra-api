import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('google.app_email'),
        pass: this.configService.get('google.app_password'),
      },
    });
  }

  async sendEmail(email: string, code: string): Promise<void> {
    console.log(`Code ${code} sent to your email: ${email}`);
    await this.transporter.sendMail({
      from: this.configService.get('google.app_email'),
      to: email,
      subject: 'Igreja Sal da Terra - Código de confirmação',
      html: `
        <div>
          <h1 style="font-weight: normal">Seu código de confirmação é: <strong>${code}</strong></h1>
          <br />
          <p>Código de acesso único, não o compartilhe.</p>
        </div>
      `,
    });
  }
}
