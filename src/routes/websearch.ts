import { Router } from 'express';
import {getGoogleSearchResults, getNaverSearchResults} from '../services/websearch';

const router = Router();

router.post('/google', async (req, res) => {
  const { name, keyword } = req.body;
  const results = await getGoogleSearchResults(name, keyword);
  res.json(results);
});

router.post('/naver', async (req, res) => {
  const { name, keyword } = req.body;
  const results = await getNaverSearchResults(name, keyword);
  res.json(results);
});

export default router;
