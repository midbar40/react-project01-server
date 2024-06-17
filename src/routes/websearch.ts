import { Router } from 'express';
import {getGoogleSearchResults, getNaverSearchResults} from '../services/websearch';

const router = Router();

router.post('/google', async (req, res) => {
  const { query, pages } = req.body;
  const results = await getGoogleSearchResults(query, pages);
  res.json(results);
});

router.post('/naver', async (req, res) => {
  const { query, pages } = req.body;
  const results = await getNaverSearchResults(query, pages);
  res.json(results);
});

export default router;
