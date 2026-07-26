import { Router, Request, Response } from "express";
import Item from "../models/item.model.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await Item.find();
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const item = await Item.create(req.body);
  res.status(201).json(item);
});

export default router;
