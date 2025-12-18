import nodemailer from "nodemailer";
import type { Contact } from "@shared/schema";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const EMAIL_FROM = process.env.EMAIL_FROM || '"DOMREALCE" <encomendas@domrealce.com>';
const EMAIL_TO = process.env.EMAIL_TO || "carloscruz@domrealce.com";

// Se faltar configuração, não tentamos “fingir” que enviamos.
// Assim ficas logo a saber que falta um Secret.
function assertEmailConfig() {
  const missing: string[] = [];
  if (!SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_PORT) missing.push("SMTP_PORT");
  if (!SMTP_USER) missing.push("SMTP_USER");
  if (!SMTP_PASS) missing.push("SMTP_PASS");
  if (missing.length) {
    throw new Error(`Email não configurado. Falta(m) Secret(s): ${missing.join(", ")}`);
  }
}

function createTransporter() {
  assertEmailConfig();

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // 465 = SSL
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendContactEmail(contact: Contact): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: contact.email, // responder vai para o cliente
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
        <h3>Ficheiros mencionados pelo cliente:</h3>
        <ul>
          ${contact.ficheiros,['?']?? ""} 
          ${contact.ficheiros.map((f) => `<li>📎 ${f}</li>`).join("")}
        </ul>
        <p><em>Nota: Os ficheiros reais devem ser solicitados directamente ao cliente.</em></p>
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

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de contacto:", error);
    return false;
  }
}

export async function sendAutoReplyEmail(contact: Contact): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: EMAIL_FROM,
      to: contact.email,
      replyTo: EMAIL_TO, // se o cliente responder, vem para ti
      subject: "Obrigado pelo seu contacto - DOMREALCE",
      html: `
        <h2>Obrigado pelo seu contacto, ${contact.nome}!</h2>
        <p>Recebemos a sua mensagem e entraremos em contacto consigo brevemente.</p>

        <h3>Resumo da sua mensagem:</h3>
        <div style="background-color:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;">
          ${contact.mensagem.replace(/\n/g, "<br>")}
        </div>

        <p>Cumprimentos,<br><strong>DOMREALCE</strong></p>
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

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro ao enviar auto-reply:", error);
    return false;
  }
}
