const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@ethereal.email',
      pass: 'test'
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'CRUST <noreply@crust.com>',
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'CRUST - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e63946;">Welcome to CRUST!</h2>
        <p>Thank you for registering. Please verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;">Verify Email</a>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
        <p style="color: #666; font-size: 12px;">If you didn't register, ignore this email.</p>
      </div>
    `
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'CRUST - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e63946;">Password Reset</h2>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;">Reset Password</a>
        <p style="color: #666; font-size: 12px;">This link expires in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `
  });
};

const sendLowStockEmail = async (adminEmail, items) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.category}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.stock}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.threshold}</td>
    </tr>
  `).join('');

  return sendEmail({
    to: adminEmail,
    subject: 'CRUST - Low Stock Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e63946;">Low Stock Alert</h2>
        <p>The following items are running low on stock:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f4f4f4;">
              <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Category</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Current Stock</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Threshold</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p>Please restock these items as soon as possible.</p>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockEmail
};
