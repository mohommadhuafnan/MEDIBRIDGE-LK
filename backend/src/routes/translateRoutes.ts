import { Router, Request, Response } from 'express';
import { translateText, getDictionary } from '../services/valseaService.js';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, target_lang } = req.body;
    if (!text) {
      res.status(400).json({ success: false, message: 'Text is required' });
      return;
    }

    const target = (target_lang || 'en') as 'en' | 'si' | 'ta';
    const result = await translateText(text, target);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/dictionary', (_req: Request, res: Response): void => {
  res.json({ success: true, data: getDictionary() });
});

export default router;
