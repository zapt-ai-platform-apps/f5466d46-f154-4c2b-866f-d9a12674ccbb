import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { brands } from '../drizzle/schema.js';

export default async function handler(req, res) {
  console.log('Brands API called with method:', req.method);
  
  try {
    const db = getDatabaseClient();
    
    if (req.method === 'GET') {
      const allBrands = await db.select().from(brands);
      
      console.log(`Found ${allBrands.length} brands`);
      res.status(200).json({ brands: allBrands });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in brands API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}