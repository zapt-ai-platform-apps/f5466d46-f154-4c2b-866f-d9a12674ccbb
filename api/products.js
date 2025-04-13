import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { products, categories, brands, productVariants, productHealthGoals, healthGoals } from '../drizzle/schema.js';
import { eq, desc, and, or, like, inArray, gte, lte } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Products API called with method:', req.method);
  
  try {
    const db = getDatabaseClient();
    
    if (req.method === 'GET') {
      const { 
        categorySlug, 
        brandSlug, 
        search, 
        healthGoal, 
        minPrice, 
        maxPrice, 
        form,
        isFeatured,
        sortBy = 'newest',
        page = 1, 
        limit = 12 
      } = req.query;
      
      console.log('Fetching products with filters:', {
        categorySlug, brandSlug, search, healthGoal, minPrice, maxPrice, form, isFeatured, sortBy, page, limit
      });
      
      let query = db.select().from(products);
      
      // Apply filters
      const filters = [];
      
      if (categorySlug) {
        // Get category ID from slug
        const category = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1);
        if (category.length > 0) {
          filters.push(eq(products.categoryId, category[0].id));
        }
      }
      
      if (brandSlug) {
        // Get brand ID from slug
        const brand = await db.select().from(brands).where(eq(brands.slug, brandSlug)).limit(1);
        if (brand.length > 0) {
          filters.push(eq(products.brandId, brand[0].id));
        }
      }
      
      if (search) {
        filters.push(
          or(
            like(products.name, `%${search}%`),
            like(products.description, `%${search}%`),
            like(products.shortDescription, `%${search}%`)
          )
        );
      }
      
      if (healthGoal) {
        // Get health goal ID from slug
        const goal = await db.select().from(healthGoals).where(eq(healthGoals.slug, healthGoal)).limit(1);
        if (goal.length > 0) {
          // Get product IDs that have this health goal
          const productIds = await db.select().from(productHealthGoals).where(eq(productHealthGoals.goalId, goal[0].id));
          if (productIds.length > 0) {
            filters.push(inArray(products.id, productIds.map(p => p.productId)));
          }
        }
      }
      
      if (minPrice) {
        filters.push(gte(products.price, parseFloat(minPrice)));
      }
      
      if (maxPrice) {
        filters.push(lte(products.price, parseFloat(maxPrice)));
      }
      
      if (form) {
        filters.push(eq(products.form, form));
      }
      
      if (isFeatured === 'true') {
        filters.push(eq(products.isFeatured, true));
      }
      
      if (filters.length > 0) {
        query = query.where(and(...filters));
      }
      
      // Count total products for pagination
      const countQuery = db.select({ count: db.fn.count() }).from(products);
      if (filters.length > 0) {
        countQuery.where(and(...filters));
      }
      const totalResult = await countQuery;
      const totalProducts = parseInt(totalResult[0]?.count || 0);
      const totalPages = Math.ceil(totalProducts / parseInt(limit));
      
      // Apply sorting
      if (sortBy === 'newest') {
        query = query.orderBy(desc(products.createdAt));
      } else if (sortBy === 'price-low') {
        query = query.orderBy(products.price);
      } else if (sortBy === 'price-high') {
        query = query.orderBy(desc(products.price));
      }
      
      // Apply pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      query = query.limit(parseInt(limit)).offset(offset);
      
      // Execute query
      const result = await query;
      
      console.log(`Found ${result.length} products`);
      res.status(200).json({ 
        products: result, 
        page: parseInt(page),
        totalPages,
        totalProducts 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in products API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}