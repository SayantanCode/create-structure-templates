import { Router } from "express";
import Item from "../models/item.model.js";

const router = Router();

// Every response follows the same shape:
//   success: { success: true, data }
//   error:   { success: false, error: { message } }
// Plain try/catch here (rather than a shared error-handling abstraction) to
// keep this template genuinely simple and readable end-to-end.

router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: err.message } });
  }
});

export default router;
