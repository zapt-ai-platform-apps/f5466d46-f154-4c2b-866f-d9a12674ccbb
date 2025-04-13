import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { categories } from '../drizzle/schema.js';

export default async function handler(req, res) {
  console.log('Categories API called with method:', req.method);
  
  try {
    const db = getDatabaseClient();
    
    if (req.method === 'GET') {
      const allCategories = await db.select().from(categories);
      
      // Organize into parent-child structure
      const parentCategories = allCategories.filter(c => !c.parentId);
      
      const categoriesWithChildren = parentCategories.map(parent => {
        const children = allCategories.filter(c => c.parentId === parent.id);
        return {
          ...parent,
          children
        };
      });
      
      console.log(`Found ${parentCategories.length} parent categories with ${allCategories.length - parentCategories.length} child categories`);
      res.status(200).json({ categories: categoriesWithChildren });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}