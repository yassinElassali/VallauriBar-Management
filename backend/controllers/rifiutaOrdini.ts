import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const rifiutaOrdini: RequestHandler = async (req, res) => {
  const { email, ordineId, prodotti } = req.body;

  if (
    typeof email !== "string" ||
    typeof ordineId !== "string" ||
    !Array.isArray(prodotti)
  ) {
    res.status(400).json({ message: "Dati mancanti o non validi" });
    return;
  }

  const conn = await client().connect();
  try {
    
    const db = conn.db(DB_NAME);
    const ordiniInAttesa = db.collection("ordiniInAttesa");

    await ordiniInAttesa.deleteOne({ codiceOrdine: ordineId });

    res.status(200).json({ message: "Ordine rifiutato e rimosso dagli ordini in attesa" });
  } catch (err) {
    console.error("Errore nella rimozione dell'ordine:", err);
    res.status(500).json({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
