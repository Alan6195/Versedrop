import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /users/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userToken = req.headers['x-user-token'] as string;
    if (!userToken) {
      return res.status(401).json({ error: 'x-user-token header required' });
    }

    const pickups = await pool.query(
      'SELECT COUNT(*)::int as total FROM user_pickups WHERE user_token = $1',
      [userToken]
    );

    const drops = await pool.query(
      'SELECT COUNT(*)::int as total FROM drops WHERE user_token = $1',
      [userToken]
    );

    // Calculate streak
    const streakResult = await pool.query(
      `SELECT DISTINCT DATE(picked_up_at AT TIME ZONE 'UTC') as pickup_date
      FROM user_pickups
      WHERE user_token = $1
      ORDER BY pickup_date DESC`,
      [userToken]
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < streakResult.rows.length; i++) {
      const pickupDate = new Date(streakResult.rows[i].pickup_date);
      pickupDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (pickupDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      user_token: userToken,
      is_plus_subscriber: false, // Stubbed for MVP
      total_pickups: pickups.rows[0].total,
      total_drops: drops.rows[0].total,
      streak_days: streak,
    });
  } catch (err) {
    console.error('GET /users/me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
