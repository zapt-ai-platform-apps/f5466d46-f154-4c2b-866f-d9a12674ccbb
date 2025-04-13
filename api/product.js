import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { products, productVariants, reviews, brands, categories } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Product API called with method:', req.method);
  
  try {
    const db = getDatabaseClient();
    
    if (req.method === 'GET') {
      const { slug } = req.query;
      
      if (!slug) {
        return res.status(400).json({ error: 'Product slug is required' });
      }
      
      console.log('Fetching product with slug:', slug);
      
      // Fetch product details
      const product = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
      
      if (!product || product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Fetch product variants
      const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product[0].id));
      
      // Fetch product brand
      const brand = await db.select().from(brands).where(eq(brands.id, product[0].brandId)).limit(1);
      
      // Fetch product category
      const category = await db.select().from(categories).where(eq(categories.id, product[0].categoryId)).limit(1);
      
      // Fetch product reviews
      const productReviews = await db.select().from(reviews).where(eq(reviews.productId, product[0].id));
      
      // Calculate average rating
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
      
      // Return complete product info
      res.status(200).json({
        ...product[0],
        variants,
        brand: brand[0] || null,
        category: category[0] || null,
        reviews: productReviews,
        averageRating,
        reviewCount: productReviews.length
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in product API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}