import { Router } from "express";
import {
  disableCharacter,
  getCharacter,
  getCharacterList,
  putCharacter,
  updateCharacter,
} from "../controllers/character.controllers";

const router = Router();

router.get("/character/:league", getCharacterList);

router.get("/character/:league/:id", getCharacter);

router.post("/character/:league/:id", putCharacter);

router.post("/character/:league/:id", updateCharacter);

router.delete("/character/:league/:id", disableCharacter);

export default router;
