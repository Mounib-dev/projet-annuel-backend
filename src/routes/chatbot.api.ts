import { Router } from "express";
import { chatBot } from "../controllers/chatbot/chatbot";
import authorize from "../middlewares/auth";

const router = Router();

router.post("/assistant", authorize, chatBot);

export default router;
