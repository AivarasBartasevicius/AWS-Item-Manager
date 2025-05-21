import { Router } from "express";
import characterRoutes from "./character.routes";
import itemFilterRoutes from "./item_filters.routes";
import profileRoutes from "./profile.routes";
import stashRoutes from "./stash.routes";

const router = Router();

router.use("/character", characterRoutes);
router.use("/item-filter", itemFilterRoutes);
router.use("/stash", stashRoutes);
router.use("/profile", profileRoutes);

export default router;
