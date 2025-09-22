import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to: string, code: string) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
     await transporter.sendMail({
     from: `"BlogApp" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your account",
      text: `Your verification code is ${code}. It will expire in 15 minutes.`,
    });
  } catch (err) {
    console.error("OTP sending failed:", err); 
  }
};
