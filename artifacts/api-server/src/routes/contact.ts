import { Router } from "express";
import nodemailer from "nodemailer";
import { readSettings } from "./smtp-settings.js";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Tüm alanlar zorunludur." });
    return;
  }

  const settings = await readSettings();

  if (!settings || !settings.host || !settings.user || !settings.password) {
    res.status(503).json({
      error: "SMTP ayarları henüz yapılandırılmamış. Lütfen admin panelinden SMTP ayarlarını girin.",
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: {
        user: settings.user,
        pass: settings.password,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${settings.user}>`,
      to: settings.toEmail,
      replyTo: email,
      subject: `[Portfolio İletişim] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Yeni İletişim Mesajı</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #666;">Ad Soyad:</td><td style="padding: 8px;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #666;">E-posta:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #666;">Konu:</td><td style="padding: 8px;">${subject}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px; border-left: 4px solid #f97316;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    res.status(500).json({ error: `E-posta gönderilemedi: ${message}` });
  }
});

export default router;
