import express, { Router, Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  res.json({
    message: "아 이런 멍청한 짓을...",
    status: 200,
  });
});

export default router;
