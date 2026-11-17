
import { Router } from "express";
import { seances, films, reservations } from "../data.js";

const router = Router();


// POST /seances
// Create a new session
router.post("/", (req, res) => {
    const { filmId, date, heure, salle, places } = req.body;

    // 1. Validate required fields
    if (
        !date || !heure || !salle ||!Number.isInteger(places) ||places < 1 ||!Number.isInteger(filmId)) {
        return res.status(400).json({
            message: "Invalid session data"
        });
    }

    // 2. Check if the film exists
    const film = films.find(f => f.id === filmId);

    if (!film) {
        return res.status(404).json({
            message: "Film not found"
        });
    }

    // 3. Generate a new ID
    const newId = seances.length > 0
        ? Math.max(...seances.map(s => s.id)) + 1
        : 1;

    // 4. Create new session
    const newSeance = {
        id: newId,filmId,date,heure,salle,places
    };

    // 5. Add to array
    seances.push(newSeance);

    res.status(201).json(newSeance);
});


// GET /seances/:id
// Get a session with remaining seats
router.get("/:id", (req, res) => {
    const { id } = req.params;

    // 1. Find session
    const seance = seances.find(
        s => s.id === Number(id)
    );

    if (!seance) {
        return res.status(404).json({
            message: "Seance not found"
        });
    }

    // 2. Find reservations for this session
    const reservationsSeance = reservations.filter(
        r => r.seanceId === Number(id)
    );

    // 3. Calculate reserved seats
    const placesReservees = reservationsSeance.reduce(
        (total, r) => total + r.places,
        0
    );

    // 4. Calculate remaining seats
    const placesRestantes = seance.places - placesReservees;

    // 5. Return session with additional field
    res.status(200).json({
        ...seance,
        placesRestantes
    });
});

export default router;
