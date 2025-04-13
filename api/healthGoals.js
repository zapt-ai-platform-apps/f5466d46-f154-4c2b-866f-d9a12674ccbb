import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { healthGoals } from '../drizzle/schema.js';

export default async function handler(req, res) {
  console.log('Health Goals API called with method:', req.method);
  
  try {
    const db = getDatabaseClient();
    
    if (req.method === 'GET') {
      const goals = await db.select().from(healthGoals);
      
      console.log(`Found ${goals.length} health goals`);
      res.status(200).json({ goals });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in health goals API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}