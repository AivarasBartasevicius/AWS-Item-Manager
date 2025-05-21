import { Router } from "express";
import {
  getPrivateProfile,
  getPublicProfile,
  putProfile,
  updateProfile,
} from "../controllers/profile.controllers";

const router = Router();

router.get("/profile/:id", getPublicProfile);

router.get("/profile/private/:id", getPrivateProfile);

router.post("/profile", putProfile);

router.post("/profile/:id", updateProfile);

export default router;
