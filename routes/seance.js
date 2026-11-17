import { Router } from "express";
const router = Router();
import{seances} from "../data.js"


router.get("/", (req, res) => {
    res.status(201).json(seances)
})


export default router;