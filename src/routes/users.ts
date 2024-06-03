import express, { Express, Request, Response } from "express";

const router = express.Router();

router.post("/checkscore", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

export default router;
