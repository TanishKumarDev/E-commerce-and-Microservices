import express from "express";
import { loginUser } from "../controllers/user.js";


const router = express.Router();

router.post("/user/login", loginUser);

export default router;