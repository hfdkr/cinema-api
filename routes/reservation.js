import { Router } from "express";
const router = Router();
import { reservations } from "../data.js";

router.get("/", (req, res) => {
    res.status(201).json(reservations)
})




export default router;