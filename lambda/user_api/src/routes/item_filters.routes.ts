import { Router } from "express";
import {
  deleteItemFilter,
  getItemFilter,
  getItemFilterList,
  putItemFilter,
  updateItemFilter,
} from "../controllers/item_filters.controllers";

const router = Router();

router.get("/item-filter", getItemFilterList);

router.get("/item-filter/:id", getItemFilter);

router.post("/item-filter", putItemFilter);

router.post("/item-filter/:id", updateItemFilter);

router.delete("/item-filter/:id", deleteItemFilter);

export default router;
