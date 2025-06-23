import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendMail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Email tasdiqlash",
      template: "./confirm", // templates/confirm.hbs bo‘lishi kerak
      context: {
        name: user.first_name,
        url: `http://localhost:3005/api/user/activate/${user.verification}`,
      },
    });
  }
}
