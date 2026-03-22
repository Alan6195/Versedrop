import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /pickups/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userToken = req.headers['x-user-token'] as string;
    if (!userToken) {
      return res.status(401).json({ error: 'x-user-token header required' });
    }

    const pickupCount = await pool.query(
      'SELECT COUNT(*)::int as total FROM user_pickups WHERE user_token = $1',
      [userToken]
    );

    const dropCount = await pool.query(
      'SELECT COUNT(*)::int as total FROM drops WHERE user_token = $1',
      [userToken]
    );

    res.json({
      total_pickups: pickupCount.rows[0].total,
      total_drops: dropCount.rows[0].total,
    });
  } catch (err) {
    console.error('GET /pickups/stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
