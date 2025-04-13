import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { eventBus } from '@/modules/core/events';
import { events } from '@/modules/cart/events';
import { supabase } from '@/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get or create guest ID
  const getGuestId = useCallback(() => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }, []);
  
  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/cart';
      
      // If not logged in, use guest ID
      if (!user) {
        const guestId = getGuestId();
        url += `?guestId=${guestId}`;
      }
      
      // Add auth header if user is logged in
      const headers = {};
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        headers.Authorization = `Bearer ${session?.access_token}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
      setCartItemCount(data.itemCount || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, getGuestId]);
  
  // Add item to cart
  const addToCart = useCallback(async (productId, quantity = 1, variantId = null) => {
    try {
      setLoading(true);
      
      const payload = {
        productId,
        quantity,
        ...(variantId && { variantId }),
      };
      
      // If not logged in, add guest ID
      if (!user) {
        payload.guestId = getGuestId();
      }
      
      // Add auth header if user is logged in
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        headers.Authorization = `Bearer ${session?.access_token}`;
      }
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      // Refresh cart
      await fetchCart();
      
      // Publish cart updated event
      eventBus.publish(events.CART_ITEM_ADDED, { productId, quantity });
      eventBus.publish(events.CART_UPDATED, { cart });
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getGuestId, fetchCart]);
  
  // Update cart item quantity
  const updateCartItem = useCallback(async (cartItemId, quantity) => {
    try {
      setLoading(true);
      
      const payload = {
        cartItemId,
        quantity,
      };
      
      // If not logged in, add guest ID
      if (!user) {
        payload.guestId = getGuestId();
      }
      
      // Add auth header if user is logged in
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        headers.Authorization = `Bearer ${session?.access_token}`;
      }
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
      
      // Refresh cart
      await fetchCart();
      
      // Publish cart updated event
      eventBus.publish(events.CART_UPDATED, { cart });
      
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getGuestId, fetchCart]);
  
  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      setLoading(true);
      
      let url = `/api/cart?cartItemId=${cartItemId}`;
      
      // If not logged in, add guest ID
      if (!user) {
        const guestId = getGuestId();
        url += `&guestId=${guestId}`;
      }
      
      // Add auth header if user is logged in
      const headers = {};
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        headers.Authorization = `Bearer ${session?.access_token}`;
      }
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      // Refresh cart
      await fetchCart();
      
      // Publish cart updated event
      eventBus.publish(events.CART_ITEM_REMOVED, { cartItemId });
      eventBus.publish(events.CART_UPDATED, { cart });
      
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getGuestId, fetchCart]);
  
  // Clear cart
  const clearCart = useCallback(async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return true;
    }
    
    try {
      setLoading(true);
      
      // Remove each item
      for (const item of cart.items) {
        await removeFromCart(item.id);
      }
      
      // Publish cart cleared event
      eventBus.publish(events.CART_CLEARED, {});
      
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [cart, removeFromCart]);
  
  // Initial fetch and subscribe to auth changes
  useEffect(() => {
    fetchCart();
    
    // Subscribe to auth events
    const authSubscription = eventBus.subscribe('auth/userSignedIn', () => {
      fetchCart();
    });
    
    const signOutSubscription = eventBus.subscribe('auth/userSignedOut', () => {
      fetchCart();
    });
    
    return () => {
      authSubscription();
      signOutSubscription();
    };
  }, [fetchCart]);
  
  return {
    cart,
    cartItemCount,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };
};