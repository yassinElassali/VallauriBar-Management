import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import QRCode from 'qrcode';

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

export const sendOrderAcceptedEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, codiceOrdine, cartItems } = req.body;

  if (!email || !codiceOrdine || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.log('Dati mancanti o non validi');
    res.status(400).json({ message: "Email, codice ordine e prodotti sono obbligatori" });
    return;
  }

  // Genera QR code come buffer immagine PNG
  let qrCodeBuffer;
  try {
    qrCodeBuffer = await QRCode.toBuffer(codiceOrdine);
  } catch (err) {
    console.error('Errore nella generazione del QR code:', err);
    res.status(500).json({ message: "Errore nella generazione del QR code" });
    return;
  }

  const productsList = cartItems.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nome}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantita}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">€${item.prezzo}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ordine Accettato - Vallauri Bar',
    html: `
      <div style="font-family: 'Roboto', sans-serif; padding: 30px; border-radius: 12px; background-color: #f9f9f9; width: 60%; margin: 0 auto;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4a90e2; font-size: 32px; font-weight: 600; text-align: center; margin-bottom: 25px; letter-spacing: 1px;">Il tuo ordine è stato accettato!</h2>
          <p style="color: #333333; font-size: 18px; line-height: 1.6; text-align: center;">Il tuo ordine <strong>#${codiceOrdine}</strong> è stato accettato e sarà pronto per il ritiro presto.</p>
          <p style="color: #333333; font-size: 18px; line-height: 1.6; text-align: center;">Dettagli dell'ordine:</p>
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; background-color: #f1f1f1; text-align: left;">Prodotto</th>
                <th style="padding: 8px; background-color: #f1f1f1; text-align: left;">Quantità</th>
                <th style="padding: 8px; background-color: #f1f1f1; text-align: left;">Prezzo</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
          </table>
          <p style="color: #333333; font-size: 18px; margin-top: 20px; text-align: center;">Codice per il ritiro: <strong>${codiceOrdine}</strong></p>
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 16px;">Scansiona questo QR code al momento del ritiro:</p>
            <img src="cid:qrCode" alt="QR Code" style="margin-top: 10px; width: 150px; height: 150px;" />
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center;">Grazie per aver ordinato da Vallauri Bar! Il tuo ordine sarà pronto presto per il ritiro.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'qrcode.png',
        content: qrCodeBuffer,
        cid: 'qrCode' 
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Errore nell\'invio email ordine accettato:', error);
      res.status(500).json({ message: "Errore nell'invio dell'email", error });
      return;
    }
    console.log('Email di conferma ordine accettato inviata:', info.response);
    res.status(200).json({ message: 'Email di conferma ordine accettato inviata con successo' });
  });
};
