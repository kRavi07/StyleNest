import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

const sentFrom = new Sender(" test-r83ql3pkpdvgzw1j.mlsender.net", "Test");

export const sendEmail = async (
  recipientEmail: string,
  recipientName: string,
  emailHtml: string,
  subject: string
) => {
  const recipients = [new Recipient(recipientEmail, recipientName)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(emailHtml);

  mailerSend.email.send(emailParams);
};
