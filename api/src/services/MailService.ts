/**
 * Service email
 * CreatedBy: dbhuan 17/07/2025
 */
import ENV from "@src/common/constants/ENV";
import nodemailer from "nodemailer";

/**
 * Thiết lập config gửi mail
 */
const transporter = nodemailer.createTransport({
  service: ENV.EmailService,
  auth: {
    user: ENV.EmailUser,
    pass: ENV.EmailPass,
  },
});

/**
 * Hàm gửi mail
 * @params email, subject, content
 */
async function sendEmail({
  email,
  subject,
  content,
}: {
  email: string;
  subject: string;
  content: string;
}) {
  await transporter.sendMail({
    from: ENV.EmailUser,
    to: email,
    subject,
    html: content,
  });
}

export default {
  sendEmail,
} as const;
