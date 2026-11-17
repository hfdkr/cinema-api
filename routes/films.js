
import { Router } from "express";
import { films, seances } from "../data.js";

const router = Router();

// GET /films
// List films + filter by genre + sort by duration
router.get("/", (req, res) => {
    const { genre, tri } = req.query;

    let result = [...films];

    if (genre) {
        result = result.filter(f => f.genre === genre);
    }

    if (tri === "duree") {
        result.sort((a, b) => a.duree - b.duree);
    }

    res.status(200).json(result);
});


// GET /films/:id
// Get a film by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const film = films.find(f => f.id === Number(id));

    if (!film) {
        return res.status(404).json({
            message: "Film not found"
        });
    }

    res.status(200).json(film);
});


// GET /films/:id/seances
// Get all sessions of a film
router.get("/:id/seances", (req, res) => {
    const { id } = req.params;

    const film = films.find(f => f.id === Number(id));

    if (!film) {
        return res.status(404).json({
            message: "Film inconnu"
        });
    }

    const result = seances.filter(
        s => s.filmId === Number(id)
    );

    res.status(200).json(result);
});


// POST /films
// Create a new film
router.post("/", (req, res) => {
    const { titre, genre, duree } = req.body;

    // Validate required fields
    if (
        typeof titre !== "string" || !titre.trim() ||
        typeof genre !== "string" || !genre.trim() ||
        typeof duree !== "number" ||
        !Number.isFinite(duree) ||
        duree <= 0
    ) {
        return res.status(400).json({
            message: "Invalid film data"
        });
    }

    // Check duplicate title
    const exists = films.some(
        f => f.titre.toLowerCase() === titre.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Film already exists"
        });
    }

    // Generate ID
    const newId = films.length > 0
        ? Math.max(...films.map(f => f.id)) + 1
        : 1;

    const newFilm = {
        id: newId,
        titre: titre.trim(),
        genre: genre.trim(),
        duree
    };

    films.push(newFilm);

    res.status(201).json(newFilm);
});


// DELETE /films/:id
// Delete a film
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const index = films.findIndex(
        f => f.id === Number(id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Film not found"
        });
    }

    // Check if film has sessions
    const hasSeances = seances.some(
        s => s.filmId === Number(id)
    );

    if (hasSeances) {
        return res.status(409).json({
            message: "Cannot delete film: it still has sessions"
        });
    }

    films.splice(index, 1);

    res.status(204).send();
});

export default router;
