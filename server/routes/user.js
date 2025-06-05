import express from "express";
import { loginUser, verifyUser, getUser } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.get("/user/me", isAuth, getUser);
export default router;