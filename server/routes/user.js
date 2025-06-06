import express from "express";
import { loginUser, verifyUser, getUser, getAllUsers } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser);
router.get("/user/me", isAuth, getUser);
router.get("/user/all", isAuth, getAllUsers);

export default router;