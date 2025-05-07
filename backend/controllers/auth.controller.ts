import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import client from "../database/mongo";

const DB_NAME = "VallauriBar";
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; 
const JWT_EXPIRATION = '10m'; 

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { password, email } = req.body;

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const utentiCollection = db.collection("LavoratoriBar");

        const utente = await utentiCollection.findOne({ email });

        if (!utente) {
            res.status(401).send({ message: "Credenziali errate" });
            return; 
        }

        const match = await bcrypt.compare(password, utente.password);

        if (match) {
            const token = jwt.sign(
                { email: utente.email, userId: utente._id },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRATION }
            );

            res.status(200).send({
                message: "Login effettuato con successo",
                token,
                nome: utente.nome,
                cognome: utente.cognome,
                email: utente.email
            });
        } else {
            res.status(401).send({ message: "Credenziali errate" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Errore del server" });
    } finally {
        await client.close();
    }
};
