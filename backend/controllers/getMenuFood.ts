import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const getMenuCibo: RequestHandler = async (req, res): Promise<void> => {
  const conn = await client().connect();
  try {
    const db = conn.db(DB_NAME);
    const menuCollection = db.collection("menuCibo");

    const menu = await menuCollection.find().toArray();
    console.log("Menu cibo trovate:", menu);

    if (menu.length === 0) {
      res.status(404).send({ message: "Menu cibo non trovato" });
      return;
    }

    res.status(200).send(menu);
  } catch (err) {
    console.error("Errore nel recupero del menu bevande:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
