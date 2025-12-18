import nodemailer from "nodemailer";
import type { Contact } from "@shared/schema";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE || "true") === "true", // 465 = true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactEmail(contact: Contact): Promise<boolean> {
  try {
    const baseUrl = "https://www.domrealce.com";

    const files = contact.ficheiros || [];

    const filesHtml =
      files.length > 0
        ? `<ul>
            ${files
              .map((entry) => {
                if (entry.includes("|")) {
                  const [name, url] = entry.split("|");
                  const fullUrl = url.startsWith("http")
                    ? url
                    : `${baseUrl}${url}`;
                  return `<li>📎 <strong>${name}</strong> — <a href="${fullUrl}" target="_blank" rel="noreferrer">Abrir / Download</a></li>`;
                }
                const fullUrl = entry.startsWith("http")
                  ? entry
                  : `${baseUrl}${entry}`;
                return `<li>📎 <a href="${fullUrl}" target="_blank" rel="noreferrer">${fullUrl}</a></li>`;
              })
              .join("")}
          </ul>`
        : `<p>—</p>`;

    const filesText =
      files.length > 0
        ? files
            .map((entry) => {
              if (entry.includes("|")) {
                const [name, url] = entry.split("|");
                const fullUrl = url.startsWith("http")
                  ? url
                  : `${baseUrl}${url}`;
                return `• ${name}\n  ${fullUrl}`;
              }
              const fullUrl = entry.startsWith("http")
                ? entry
                : `${baseUrl}${entry}`;
              return `• ${fullUrl}`;
            })
            .join("\n")
        : "—";

    const mailOptions = {
      from: `"DOMREALCE Website" <${process.env.SMTP_USER}>`,
      replyTo: contact.email,
      to: "carloscruz@domrealce.com",
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

        <h3>Ficheiros enviados pelo cliente:</h3>
        ${filesHtml}

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

Ficheiros enviados pelo cliente:
${filesText}

---
Esta mensagem foi enviada através do formulário de contacto do website da DOMREALCE.
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de contacto:", error);
    return false;
  }
}

    const info = await transporter.sendMail(mailOptions);
    
    // For development, log the email content
    console.log('Email enviado:', info);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

// Auto-reply email to the customer
export async function sendAutoReplyEmail(contact: Contact): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"DOMREALCE" <noreply@domrealce.com>',
      to: contact.email,
      subject: 'Obrigado pelo seu contacto - DOMREALCE',
      html: `
        <h2>Obrigado pelo seu contacto, ${contact.nome}!</h2>
        <p>Recebemos a sua mensagem e entraremos em contacto consigo brevemente.</p>
        
        <h3>Resumo da sua mensagem:</h3>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${contact.mensagem.replace(/\n/g, '<br>')}
        </div>
        
        <p>Para contacto mais direto:</p>
        <ul>
          <li>📞 <strong>Telefone:</strong> +351 930 682 725</li>
          <li>📧 <strong>Email:</strong> carloscruz@domrealce.com</li>
          <li>📍 <strong>Morada:</strong> Rua de Rebolido, 42, 4580-402 Gondalães, Paredes</li>
        </ul>
        
        <p>Cumprimentos,<br>
        <strong>DOMREALCE</strong><br>
        Comunicação Visual & Publicidade</p>
      `,
      text: `
        Obrigado pelo seu contacto, ${contact.nome}!
        
        Recebemos a sua mensagem e entraremos em contacto consigo brevemente.
        
        Resumo da sua mensagem:
        ${contact.mensagem}
        
        Para contacto mais direto:
        Telefone: +351 930 682 725
        Email: carloscruz@domrealce.com
        Morada: Rua de Rebolido, 42, 4580-402 Gondalães, Paredes
        
        Cumprimentos,
        DOMREALCE
        Comunicação Visual & Publicidade
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Auto-reply enviado:', info);
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar auto-reply:', error);
    return false;
  }
}