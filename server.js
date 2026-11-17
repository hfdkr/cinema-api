import express from "express";
const app = express();
import filmsRoutes from "./routes/films.js";
import reservationRoutes from "./routes/reservation.js";
import seanceRoutes from "./routes/seance.js";

app.use("/films", filmsRoutes);

app.use("/reservations", reservationRoutes);

app.use("/seance", seanceRoutes);


app.use(express.json());
app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));