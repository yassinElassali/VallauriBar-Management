import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const confermaRitiroOrdine: RequestHandler = async (req, res) => {
  const conn = await client().connect();
  try {
    const { ordineId } = req.body;

    if (!ordineId) {
      res.status(400).send({ message: "ordineId mancante" });
      return;
    }

    const db = conn.db(DB_NAME);
    const ordiniAccettati = db.collection("ordiniAccettati");
    const ordiniRitirati = db.collection("ordiniRitirati");

    const ordine = await ordiniAccettati.findOne({ ordineId });

    if (!ordine) {
      res.status(404).send({ message: "Ordine non trovato" });
      return;
    }

    await ordiniRitirati.insertOne({
      ...ordine,
      ritiratoIl: new Date()
    });

    await ordiniAccettati.deleteOne({ ordineId });

    res.status(200).send({ message: "Ordine ritirato con successo" });
  } catch (err) {
    console.error("Errore durante il ritiro:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
