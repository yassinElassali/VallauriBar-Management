import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const getTuttiGliOrdiniAccettati: RequestHandler = async (req, res): Promise<void> => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const ordiniCollection = db.collection("ordiniAccettati");

    const ordini = await ordiniCollection.find().toArray();
    console.log("Ordini trovati:", ordini);

    if (!ordini.length) {
      res.status(404).send({ message: "Nessun ordine trovato" });
      return;
    }

    res.status(200).send(ordini);
  } catch (err) {
    console.error("Errore nel recupero degli ordini:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await client.close();
  }
};
