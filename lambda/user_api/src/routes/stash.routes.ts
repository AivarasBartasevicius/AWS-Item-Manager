import { Router } from "express";
import {
  getStash,
  getStashList,
  putStash,
  updateStash,
} from "../controllers/stash.controllers";

const router = Router();

router.get("/stash/:league", getStashList);

router.get("/stash/:league/:id", getStash);

router.post("/stash/:league/:id", putStash);

//TODO: add post for updating a list of stashes

router.post("/stash/:league/:id", updateStash);

export default router;
