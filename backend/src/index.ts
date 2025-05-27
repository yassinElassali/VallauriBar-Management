import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getOrdiniAttesa } from "../controllers/getOrdiniAttesa";
import { addOrdiniAccettati } from "../controllers/accettoOrdini";
import { sendOrderAcceptedEmail } from "../controllers/sendEmailOrdineAccettato";
import {sendEmailOrdineRifiutato } from "../controllers/sendEmailOrdineRifiutato";
import { rifiutaOrdini } from "../controllers/rifiutaOrdini";
import { getTuttiGliOrdiniAccettati } from "../controllers/resocontoOrdiniAccettati";
import { getMenuBevande } from "../controllers/getMenuDrink";
import { getMenuCibo } from "../controllers/getMenuFood";
import { modificaProdotto } from "../controllers/modificaProdotto";
import { deleteProdotto } from "../controllers/eliminaProdotto";
import { aggiungiProdotto } from "../controllers/aggiungiProdotto";
import {getOrdineById} from "../controllers/getProdottoById";

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
app.get("/resocontoOrdiniAccettati",getTuttiGliOrdiniAccettati);
app.get("/menuBevande", getMenuBevande);
app.get("/menuCibo", getMenuCibo);
app.put('/cibo/:id', modificaProdotto);
app.put('/bevande/:id', modificaProdotto);
app.delete('/cibo/:id', deleteProdotto);
app.delete('/bevande/:id', deleteProdotto);
app.post('/:tipo', aggiungiProdotto); 
app.get("/ordini/id/:ordineId", getOrdineById);

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
