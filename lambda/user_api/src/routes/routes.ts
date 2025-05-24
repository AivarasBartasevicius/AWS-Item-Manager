import { Router } from "express";
import characterRoutes from "./character.routes";
import itemFilterRoutes from "./item_filters.routes";
import profileRoutes from "./profile.routes";
import stashRoutes from "./stash.routes";

const router = Router();

router.use(characterRoutes);
router.use(itemFilterRoutes);
router.use(stashRoutes);
router.use(profileRoutes);

export default router;
