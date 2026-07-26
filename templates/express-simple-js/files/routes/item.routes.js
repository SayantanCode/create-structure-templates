import { Router } from "express";
import Item from "../models/item.model.js";

const router = Router();

router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.post("/", async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json(item);
});

export default router;
