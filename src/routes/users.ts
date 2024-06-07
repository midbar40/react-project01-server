import express, { Router, Request, Response } from "express";
import websearch from "../websearch";

const { getGoogleSearchResults, getNaverSearchResults } = websearch;
const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  
  // getGoogleSearchResults(req.body.name, 5)
  // .then(results => {
  //   console.log(results)
  //   res.json(results)
  // })
  // .catch(err => console.error(err));
console.log('리퀘바디',req.body.name)
  getNaverSearchResults(req.body.name, 5)
  .then(results => {
    console.log('출력',results)
    res.json(results)
  })
  .catch(err => console.error(err));
 
});

export default router;
