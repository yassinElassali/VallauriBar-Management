import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const getOrdineById: RequestHandler = async (req, res) => {
  const { ordineId } = req.params;

  if (typeof ordineId !== "string") {
    res.status(400).json({ message: "ID dell'ordine non valido" });
    return;
  }

  const conn = await client().connect();
  try {
    const db = conn.db(DB_NAME);
    const ordini = db.collection("ordiniAccettati");

    const ordine = await ordini.findOne({ ordineId });

    if (!ordine) {
      res.status(404).json({ message: "Ordine non trovato" });
      return;
    }

    res.status(200).json(ordine);
  } catch (err) {
    console.error("Errore nella ricerca dell'ordine:", err);
    res.status(500).json({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
