import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const getOrdiniAttesa: RequestHandler = async (req, res): Promise<void> => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const carrelloCollection = db.collection("ordiniInAttesa");

    const result = await carrelloCollection.find().toArray();
    console.log("ordini trovati:", result);

    if (result.length === 0) {
      res.status(404).send({ message: "Carrello non trovato" });
      return;
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Errore nel recupero degli ordini:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await client.close();
  }
};
