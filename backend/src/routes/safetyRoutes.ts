import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { SafetyAlert } from '../models/SafetyAlert.js';
import { INITIAL_SAFETY_ALERTS } from '../services/dataStore.js';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { severity, alert_type } = req.query;

    if (mongoose.connection.readyState === 1) {
      try {
        const query: Record<string, any> = { active: true };
        if (severity) query.severity = severity;
        if (alert_type) query.alert_type = alert_type;
        const alerts = await SafetyAlert.find(query).sort({ published_at: -1 }).lean();
        if (alerts.length > 0) {
          res.json({ success: true, data: alerts });
          return;
        }
      } catch (e) {}
    }

    let results = [...INITIAL_SAFETY_ALERTS];
    if (severity) {
      results = results.filter((a) => a.severity === severity);
    }
    if (alert_type) {
      results = results.filter((a) => a.alert_type === alert_type);
    }

    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = INITIAL_SAFETY_ALERTS.find((a) => a._id === req.params.id) || INITIAL_SAFETY_ALERTS[0];
    res.json({ success: true, data: alert });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
