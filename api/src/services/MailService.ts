/**
 * Service email
 * CreatedBy: dbhuan 17/07/2025
 */
import nodemailer from "nodemailer";

console.log(
  process.env.EMAIL_SERVICE,
  process.env.EMAIl_USER,
  process.env.EMAIL_PASS
);

/**
 * Thiết lập config gửi mail
 */
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: content,
  });
}

export default {
  sendEmail,
} as const;
