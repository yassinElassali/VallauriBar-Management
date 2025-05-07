import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailOrdineRifiutato = (req: Request, res: Response): void => {
  const { email, codiceOrdine, disponibili, nonDisponibili } = req.body;

  if (!email || !codiceOrdine || !Array.isArray(disponibili) || !Array.isArray(nonDisponibili)) {
    res.status(400).json({ message: "Dati incompleti o errati" });
    return;
  }

  const formatList = (items: any[]) =>
    items.map(item => `<li>${item.nome} (x${item.quantita})</li>`).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Resoconto ordine rifiutato - Vallauri Bar`,
    html: `
      <div style="font-family: 'Roboto', sans-serif; padding: 30px; border-radius: 12px; background-color: #f9f9f9; width: 60%; margin: 0 auto;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #f44336; font-size: 32px; font-weight: 600; text-align: center; margin-bottom: 25px; letter-spacing: 1px;">Ordine #${codiceOrdine} - Prodotti non disponibili</h2>
          <p style="color: #333333; font-size: 18px; line-height: 1.6; text-align: center;">Grazie per il tuo ordine. Purtroppo alcuni prodotti non sono disponibili.</p>
          
          <h3 style="color: #27ae60; margin-top: 20px; font-size: 24px; text-align: center;">Prodotti Disponibili</h3>
          <ul style="padding-left: 20px; color: #2c3e50; font-size: 18px;">
            ${formatList(disponibili)}
          </ul>
          
          <h3 style="color: #e74c3c; margin-top: 20px; font-size: 24px; text-align: center;">Prodotti Non Disponibili</h3>
          <ul style="padding-left: 20px; color: #2c3e50; font-size: 18px;">
            ${formatList(nonDisponibili)}
          </ul>
          
          <p style="color: #333333; font-size: 18px; line-height: 1.6; margin-top: 20px; text-align: center;">Se desideri effettuare un nuovo ordine con i prodotti disponibili, ti invitiamo a riprovare.</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center;">Grazie per aver ordinato da Vallauri Bar.</p>
        </div>
      </div>
    `
  };
  
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Errore nell'invio email resoconto:", error);
      res.status(500).json({ message: "Errore nell'invio email", error });
      return;
    }
    res.status(200).json({ message: "Email resoconto inviata con successo" });
  });

  
};
