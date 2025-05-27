import { RequestHandler } from "express";
import client from "../database/mongo";

const DB_NAME = "VallauriBar";

export const aggiungiProdotto: RequestHandler = async (req, res) => {
  const conn = await client().connect();
  try {
    const { tipo } = req.params; // 'cibo' o 'bevande'
    const data = req.body; // { nome, prezzo }

    if (!['cibo', 'bevande'].includes(tipo)) {
      res.status(400).send({ message: "Tipo prodotto non valido" });
      return;
    }

    if (!data.nome || typeof data.prezzo !== 'number') {
      res.status(400).send({ message: "Dati mancanti o non validi" });
      return;
    }

    const collectionName = tipo === 'cibo' ? "menuCibo" : "menuBevande";

    const db = conn.db(DB_NAME);
    const result = await db.collection(collectionName).insertOne({
      nome: data.nome,
      prezzo: data.prezzo
    });

    res.status(201).send({ message: "Prodotto aggiunto", id: result.insertedId });
  } catch (err) {
    console.error("Errore nell'aggiunta:", err);
    res.status(500).send({ message: "Errore del server" });
  } finally {
    await conn.close();
  }
};
