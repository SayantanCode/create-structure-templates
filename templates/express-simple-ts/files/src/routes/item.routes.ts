import { Router, Request, Response } from "express";
import Item from "../models/item.model.js";

const router = Router();

// Every response follows the same shape:
//   success: { success: true, data }
//   error:   { success: false, error: { message } }
// Plain try/catch here (rather than a shared error-handling abstraction) to
// keep this template genuinely simple and readable end-to-end.

router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: (err as Error).message } });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: { message: (err as Error).message } });
  }
});

export default router;
