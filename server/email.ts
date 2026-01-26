import nodemailer from "nodemailer";
import type { Contact } from "@shared/schema";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO || "carloscruz@domrealce.com";

function getSmtpConfig() {
  const missing: string[] = [];
  if (!SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_PORT) missing.push("SMTP_PORT");
  if (!SMTP_USER) missing.push("SMTP_USER");
  if (!SMTP_PASS) missing.push("SMTP_PASS");

  if (missing.length) {
    console.error(`❌ Email config missing: ${missing.join(", ")}`);
    return null;
  }

  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    pass: SMTP_PASS,
  };
}

function createTransporter() {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error(`SMTP não configurado. Verifique os Secrets.`);
  }

  const isSecure = config.port === 465;

  console.log(`📧 SMTP Config: host=${config.host}, port=${config.port}, secure=${isSecure}, user=${config.user?.substring(0, 5)}...`);

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: isSecure,
    requireTLS: !isSecure && config.port === 587,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
  error?: string;
  errorCode?: string;
}

export async function sendContactEmail(contact: Contact): Promise<EmailResult> {
  const config = getSmtpConfig();
  if (!config) {
    return { success: false, error: "SMTP não configurado" };
  }

  const fromEmail = config.user;
  const toEmail = CONTACT_TO;

  console.log(`📧 Sending contact email: from=${fromEmail}, to=${toEmail}, replyTo=${contact.email}`);

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"DOMREALCE" <${fromEmail}>`,
      to: toEmail,
      replyTo: contact.email,
      subject: `Nova mensagem de contacto - ${contact.nome}`,
      html: `
        <h2>Nova mensagem de contacto recebida</h2>
        <p><strong>Nome:</strong> ${contact.nome}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Data:</strong> ${
          contact.createdAt
            ? new Date(contact.createdAt).toLocaleString("pt-PT")
            : new Date().toLocaleString("pt-PT")
        }</p>
        <h3>Mensagem:</h3>
        <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;">
          ${contact.mensagem.replace(/\n/g, "<br>")}
        </div>
        ${
          contact.ficheiros && contact.ficheiros.length > 0
            ? `
        <h3>Ficheiros enviados pelo cliente:</h3>
        ${
          contact.ficheiros && contact.ficheiros.length > 0
            ? `<ul>
                ${contact.ficheiros
                  .map((entry) => {
                    if (entry.includes("|")) {
                      const [name, url] = entry.split("|");
                      const fullUrl = url.startsWith("http")
                        ? url
                        : `https://www.domrealce.com${url}`;
                      return `<li>📎 <strong>${name}</strong> — <a href="${fullUrl}" target="_blank" rel="noreferrer">Abrir / Download</a></li>`;
                    }
                    const fullUrl = entry.startsWith("http")
                      ? entry
                      : `https://www.domrealce.com${entry}`;
                    return `<li>📎 <a href="${fullUrl}" target="_blank" rel="noreferrer">${fullUrl}</a></li>`;
                  })
                  .join("")}
              </ul>`
            : `<p>—</p>`
        }
        `
            : ""
        }
        <hr>
        <p style="color:#666;font-size:12px;">
          Esta mensagem foi enviada através do formulário de contacto do website da DOMREALCE.
        </p>
      `,
      text: `
Nova mensagem de contacto recebida

Nome: ${contact.nome}
Email: ${contact.email}
Data: ${
        contact.createdAt
          ? new Date(contact.createdAt).toLocaleString("pt-PT")
          : new Date().toLocaleString("pt-PT")
      }

Mensagem:
${contact.mensagem}

${
        contact.ficheiros && contact.ficheiros.length > 0
          ? `
Ficheiros mencionados pelo cliente:
${contact.ficheiros.map((f) => `- ${f}`).join("\n")}

Nota: Os ficheiros reais devem ser solicitados directamente ao cliente.
`
          : ""
      }

---
Esta mensagem foi enviada através do formulário de contacto do website da DOMREALCE.
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Contact email sent: messageId=${info.messageId}, accepted=${JSON.stringify(info.accepted)}, rejected=${JSON.stringify(info.rejected)}`);

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted as string[],
      rejected: info.rejected as string[],
    };
  } catch (error: any) {
    console.error(`❌ Contact email FAILED:`, {
      code: error.code,
      response: error.response,
      message: error.message,
      command: error.command,
    });

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
}

export async function sendAutoReplyEmail(contact: Contact): Promise<EmailResult> {
  const config = getSmtpConfig();
  if (!config) {
    return { success: false, error: "SMTP não configurado" };
  }

  const fromEmail = config.user;

  console.log(`📧 Sending auto-reply: from=${fromEmail}, to=${contact.email}`);

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"DOMREALCE" <${fromEmail}>`,
      to: contact.email,
      replyTo: CONTACT_TO,
      subject: "Obrigado pelo seu contacto - DOMREALCE",
      html: `
        <h2>Obrigado pelo seu contacto, ${contact.nome}!</h2>
        <p>Recebemos a sua mensagem e entraremos em contacto consigo brevemente.</p>

        <h3>Resumo da sua mensagem:</h3>
        <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;">
          ${contact.mensagem.replace(/\n/g, "<br>")}
        </div>

        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

<p style="margin:0 0 6px 0;font-size:14px;">
  Com os melhores cumprimentos,
</p>

<p style="margin:0;font-size:16px;font-weight:700;color:#000;">
  DOMREALCE
</p>

<p style="margin:6px 0 0 0;font-size:13px;color:#555;">
  Comunicação Visual · Impressão Digital
</p>

<p style="margin:10px 0 0 0;font-size:13px;color:#555;">
  📍 Rua de Rebolido, 42 · 4580-402 Gondalães, Paredes<br>
  📞 <a href="tel:+351930682725" style="color:#555;text-decoration:none;">+351 930 682 725</a> ·
  ✉️ <a href="mailto:carloscruz@domrealce.com" style="color:#555;text-decoration:none;">carloscruz@domrealce.com</a>
</p>

<p style="margin:8px 0 0 0;font-size:12px;color:#777;">
  <a href="https://www.domrealce.com" target="_blank" style="color:#777;text-decoration:none;">
    www.domrealce.com
  </a>
</p>

      `,
      text: `
Obrigado pelo seu contacto, ${contact.nome}!

Recebemos a sua mensagem e entraremos em contacto consigo brevemente.

Resumo da sua mensagem:
${contact.mensagem}

Cumprimentos,
DOMREALCE
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Auto-reply sent: messageId=${info.messageId}, accepted=${JSON.stringify(info.accepted)}, rejected=${JSON.stringify(info.rejected)}`);

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted as string[],
      rejected: info.rejected as string[],
    };
  } catch (error: any) {
    console.error(`❌ Auto-reply FAILED:`, {
      code: error.code,
      response: error.response,
      message: error.message,
      command: error.command,
    });

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
}

export async function testEmailConnection(): Promise<EmailResult> {
  const config = getSmtpConfig();
  if (!config) {
    return { success: false, error: "SMTP não configurado" };
  }

  console.log(`🔧 Testing SMTP connection...`);

  try {
    const transporter = createTransporter();

    await transporter.verify();

    console.log(`✅ SMTP connection verified successfully`);

    const testResult = await transporter.sendMail({
      from: `"DOMREALCE Test" <${config.user}>`,
      to: CONTACT_TO,
      subject: `[TESTE] Email de teste - ${new Date().toLocaleString("pt-PT")}`,
      text: "Este é um email de teste do sistema DOMREALCE. Se recebeu este email, o SMTP está a funcionar corretamente.",
      html: `<h2>Teste de Email</h2><p>Este é um email de teste do sistema DOMREALCE.</p><p>Se recebeu este email, o SMTP está a funcionar corretamente.</p><p>Data: ${new Date().toLocaleString("pt-PT")}</p>`,
    });

    console.log(`✅ Test email sent: messageId=${testResult.messageId}, accepted=${JSON.stringify(testResult.accepted)}`);

    return {
      success: true,
      messageId: testResult.messageId,
      accepted: testResult.accepted as string[],
      rejected: testResult.rejected as string[],
    };
  } catch (error: any) {
    console.error(`❌ SMTP test FAILED:`, {
      code: error.code,
      response: error.response,
      message: error.message,
    });

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
}
