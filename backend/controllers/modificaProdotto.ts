import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const modificaProdotto: RequestHandler = async (req, res) => {
  const conn = await client().connect();
  const { id } = req.params;
  const data = req.body;

  const collectionName = req.path.includes("/cibo/") ? "menuCibo" : "menuBevande";

  try {
    const db = conn.db(DB_NAME);
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: { nome: data.nome, prezzo: data.prezzo } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).send({ message: "Prodotto non trovato o già aggiornato" });
      return;
    }

    res.status(200).send({ message: "Prodotto aggiornato" });
  } catch (err) {
    console.error("Errore nella modifica:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
