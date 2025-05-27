import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const addOrdiniAccettati: RequestHandler = async (req, res) => {
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
    const ordiniAccettati = db.collection("ordiniAccettati");
    const ordiniInAttesa = db.collection("ordiniInAttesa");

    // Inserisce l'ordine negli accettati
    await ordiniAccettati.insertOne({
      email,
      ordineId,
      prodotti,
      stato: "Accettato",
      creatoIl: new Date(),
    });

    await ordiniInAttesa.deleteOne({ codiceOrdine: ordineId });

    res.status(200).json({ message: "Ordine accettato e rimosso dagli ordini in attesa" });
  } catch (err) {
    console.error("Errore nel salvataggio o nella rimozione dell'ordine:", err);
    res.status(500).json({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
