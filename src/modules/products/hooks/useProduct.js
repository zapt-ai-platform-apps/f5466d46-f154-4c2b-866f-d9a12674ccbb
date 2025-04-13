import { useState, useEffect } from 'react';

export const useProduct = (productSlug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/product?slug=${encodeURIComponent(productSlug)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productSlug]);
  
  return {
    product,
    loading,
    error
  };
};