import { Router } from "express";
import { isUsername, saveUser, signIn } from "../controllers/auth";
const router = Router();

router.get("/signIn", signIn);
router.post("/create", saveUser);
router.get("/checkUsername", isUsername);

module.exports = router;
