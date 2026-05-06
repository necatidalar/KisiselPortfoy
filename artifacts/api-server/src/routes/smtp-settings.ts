import { Router } from "express";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const router = Router();

const DATA_DIR = path.resolve(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "smtp-settings.json");

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  toEmail: string;
}

async function readSettings(): Promise<SmtpSettings | null> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw) as SmtpSettings;
  } catch {
    return null;
  }
}

async function writeSettings(settings: SmtpSettings): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

router.get("/smtp-settings", async (_req, res) => {
  const settings = await readSettings();
  if (!settings) {
    res.json({ configured: false });
    return;
  }
  res.json({
    configured: true,
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    user: settings.user,
    toEmail: settings.toEmail,
  });
});

router.post("/smtp-settings", async (req, res) => {
  const { host, port, secure, user, password, toEmail } = req.body;

  if (!host || !port || !user || !toEmail) {
    res.status(400).json({ error: "host, port, user ve toEmail zorunludur." });
    return;
  }

  const existing = await readSettings();

  const settings: SmtpSettings = {
    host: String(host),
    port: Number(port),
    secure: Boolean(secure),
    user: String(user),
    password: password !== undefined ? String(password) : (existing?.password ?? ""),
    toEmail: String(toEmail),
  };

  await writeSettings(settings);
  res.json({ success: true });
});

export { readSettings };
export default router;
