import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import { getNewCollection, updateNewCollection } from "../controllers/newCollectionController.js";

const router = express.Router();

// Public — homepage "New Collection · Eternal Beauty" section reads this
router.get("/", getNewCollection);

// Admin
router.use(protect, adminOnly);
router.put("/", uploadProduct.single("image"), updateNewCollection);

export default router;
