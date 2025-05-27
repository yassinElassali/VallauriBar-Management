import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const deleteProdotto: RequestHandler = async (req, res) => {
  const conn = await client().connect();
  const { id } = req.params;

  const collectionName = req.path.includes("/cibo/") ? "menuCibo" : "menuBevande";

  try {
    const db = conn.db(DB_NAME);
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).send({ message: "Prodotto non trovato" });
      return;
    }

    res.status(200).send({ message: "Prodotto eliminato" });
  } catch (err) {
    console.error("Errore nella cancellazione:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
