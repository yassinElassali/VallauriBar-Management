import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const getOrdiniAttesa: RequestHandler = async (req, res) => {
  try {
    const conn = await client().connect();
    const db = conn.db(DB_NAME);
    const ordiniInAttesaCollection = db.collection("ordiniInAttesa");

    const result = await ordiniInAttesaCollection.find().toArray();
    console.log("Ordini in attesa trovati:", result);

    res.status(200).send(result);
    await conn.close();
  } catch (err) {
    console.error("Errore nel recupero degli ordini:", err);
    res.status(500).send({ message: "Errore del server" });
  }
};
