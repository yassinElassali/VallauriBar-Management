import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getOrdiniAttesa } from "../controllers/getOrdiniAttesa";
import { addOrdiniAccettati } from "../controllers/accettoOrdini";
import { sendOrderAcceptedEmail } from "../controllers/sendEmailOrdineAccettato";
import {sendEmailOrdineRifiutato } from "../controllers/sendEmailOrdineRifiutato";
import { rifiutaOrdini } from "../controllers/rifiutaOrdini";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    console.log("GET /");
    res.send({ status: 'ok' });
});

app.get("/ordiniInAttesa", getOrdiniAttesa);
app.post ("/accettaOrdine", addOrdiniAccettati);
app.post("/ordini/email-accettata", sendOrderAcceptedEmail);
app.post("/ordini/email-rifiutata", sendEmailOrdineRifiutato);
app.post("/rifiutaOrdine", rifiutaOrdini);

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
