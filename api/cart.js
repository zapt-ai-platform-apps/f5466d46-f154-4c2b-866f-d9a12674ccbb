import Sentry from './_sentry.js';
import { getDatabaseClient } from './_apiUtils.js';
import { authenticateUser } from './_apiUtils.js';
import { carts, cartItems, products, productVariants } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Cart API called with method:', req.method);
  
  const db = getDatabaseClient();
  
  try {
    // Handle different request methods
    if (req.method === 'GET') {
      // For GET requests - fetch cart
      let user = null;
      let guestId = null;
      
      try {
        user = await authenticateUser(req);
      } catch (error) {
        // User not authenticated, check for guest ID
        guestId = req.query.guestId;
        if (!guestId) {
          return res.status(400).json({ error: 'Guest ID is required for unauthenticated users' });
        }
      }
      
      console.log('Fetching cart for', user ? `user: ${user.id}` : `guest: ${guestId}`);
      
      // Find or create cart
      let cart;
      
      if (user) {
        // Find user cart
        cart = await db.select().from(carts).where(eq(carts.userId, user.id)).limit(1);
      } else {
        // Find guest cart
        cart = await db.select().from(carts).where(eq(carts.guestId, guestId)).limit(1);
      }
      
      if (!cart || cart.length === 0) {
        // Create new cart
        const newCart = user 
          ? { userId: user.id } 
          : { guestId };
        
        const insertedCart = await db.insert(carts).values(newCart).returning();
        cart = insertedCart;
      } else {
        cart = cart[0];
      }
      
      // Get cart items with product details
      const cartItemsWithDetails = await db
        .select({
          cartItem: cartItems,
          product: products,
          variant: productVariants
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
        .where(eq(cartItems.cartId, cart.id));
      
      // Format response
      const formattedItems = cartItemsWithDetails.map(item => ({
        id: item.cartItem.id,
        productId: item.cartItem.productId,
        variantId: item.cartItem.variantId,
        quantity: item.cartItem.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.variant ? item.variant.price : item.product.price,
          mrp: item.variant ? item.variant.mrp : item.product.mrp,
          imageUrl: item.product.imageUrls?.[0] || null,
          weight: item.variant ? item.variant.weight : item.product.weight,
          variantName: item.variant ? item.variant.name : null
        }
      }));
      
      // Calculate cart totals
      const cartTotal = formattedItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.price) * item.quantity), 0);
      
      const cartMrp = formattedItems.reduce((sum, item) => 
        sum + (parseFloat(item.product.mrp) * item.quantity), 0);
      
      console.log(`Found cart with ${formattedItems.length} items`);
      res.status(200).json({
        id: cart.id,
        items: formattedItems,
        totalAmount: cartTotal,
        totalMrp: cartMrp,
        discount: cartMrp - cartTotal,
        itemCount: formattedItems.length
      });
    } else if (req.method === 'POST') {
      // For POST requests - add item to cart
      let user = null;
      let guestId = null;
      
      try {
        user = await authenticateUser(req);
      } catch (error) {
        // User not authenticated, check for guest ID
        guestId = req.body.guestId;
        if (!guestId) {
          return res.status(400).json({ error: 'Guest ID is required for unauthenticated users' });
        }
      }
      
      const { productId, variantId, quantity } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity is required' });
      }
      
      console.log('Adding to cart:', { productId, variantId, quantity });
      
      // Find or create cart
      let cart;
      
      if (user) {
        // Find user cart
        cart = await db.select().from(carts).where(eq(carts.userId, user.id)).limit(1);
      } else {
        // Find guest cart
        cart = await db.select().from(carts).where(eq(carts.guestId, guestId)).limit(1);
      }
      
      if (!cart || cart.length === 0) {
        // Create new cart
        const newCart = user 
          ? { userId: user.id } 
          : { guestId };
        
        const insertedCart = await db.insert(carts).values(newCart).returning();
        cart = insertedCart[0];
      } else {
        cart = cart[0];
      }
      
      // Check if item already exists in cart
      const existingItem = await db.select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, productId),
            variantId ? eq(cartItems.variantId, variantId) : eq(cartItems.variantId, null)
          )
        )
        .limit(1);
      
      if (existingItem && existingItem.length > 0) {
        // Update existing item quantity
        const updatedItem = await db.update(cartItems)
          .set({ quantity: existingItem[0].quantity + quantity })
          .where(eq(cartItems.id, existingItem[0].id))
          .returning();
        
        console.log('Updated existing cart item');
        res.status(200).json(updatedItem[0]);
      } else {
        // Add new item to cart
        const newItem = {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity
        };
        
        const insertedItem = await db.insert(cartItems).values(newItem).returning();
        
        console.log('Added new item to cart');
        res.status(201).json(insertedItem[0]);
      }
    } else if (req.method === 'PUT') {
      // For PUT requests - update cart item
      let user = null;
      let guestId = null;
      
      try {
        user = await authenticateUser(req);
      } catch (error) {
        // User not authenticated, check for guest ID
        guestId = req.body.guestId;
        if (!guestId) {
          return res.status(400).json({ error: 'Guest ID is required for unauthenticated users' });
        }
      }
      
      const { cartItemId, quantity } = req.body;
      
      if (!cartItemId) {
        return res.status(400).json({ error: 'Cart item ID is required' });
      }
      
      if (quantity === undefined) {
        return res.status(400).json({ error: 'Quantity is required' });
      }
      
      console.log('Updating cart item:', { cartItemId, quantity });
      
      // Get cart item
      const cartItem = await db.select().from(cartItems).where(eq(cartItems.id, cartItemId)).limit(1);
      
      if (!cartItem || cartItem.length === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      // Get cart
      const cart = await db.select().from(carts).where(eq(carts.id, cartItem[0].cartId)).limit(1);
      
      if (!cart || cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      
      // Verify ownership
      if (user && cart[0].userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this cart' });
      }
      
      if (guestId && cart[0].guestId !== guestId) {
        return res.status(403).json({ error: 'Not authorized to modify this cart' });
      }
      
      if (quantity <= 0) {
        // Remove item from cart
        await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
        console.log('Removed item from cart');
        res.status(200).json({ message: 'Item removed from cart' });
      } else {
        // Update item quantity
        const updatedItem = await db.update(cartItems)
          .set({ quantity })
          .where(eq(cartItems.id, cartItemId))
          .returning();
        
        console.log('Updated cart item quantity');
        res.status(200).json(updatedItem[0]);
      }
    } else if (req.method === 'DELETE') {
      // For DELETE requests - remove item from cart
      let user = null;
      let guestId = null;
      
      try {
        user = await authenticateUser(req);
      } catch (error) {
        // User not authenticated, check for guest ID
        guestId = req.query.guestId;
        if (!guestId) {
          return res.status(400).json({ error: 'Guest ID is required for unauthenticated users' });
        }
      }
      
      const { cartItemId } = req.query;
      
      if (!cartItemId) {
        return res.status(400).json({ error: 'Cart item ID is required' });
      }
      
      console.log('Removing item from cart:', { cartItemId });
      
      // Get cart item
      const cartItem = await db.select().from(cartItems).where(eq(cartItems.id, cartItemId)).limit(1);
      
      if (!cartItem || cartItem.length === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      // Get cart
      const cart = await db.select().from(carts).where(eq(carts.id, cartItem[0].cartId)).limit(1);
      
      if (!cart || cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      
      // Verify ownership
      if (user && cart[0].userId !== user.id) {
        return res.status(403).json({ error: 'Not authorized to modify this cart' });
      }
      
      if (guestId && cart[0].guestId !== guestId) {
        return res.status(403).json({ error: 'Not authorized to modify this cart' });
      }
      
      // Remove item from cart
      await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
      
      console.log('Removed item from cart');
      res.status(200).json({ message: 'Item removed from cart' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in cart API:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}