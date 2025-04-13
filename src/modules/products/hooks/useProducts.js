import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useProducts = (initialCategorySlug = null) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get filter values from URL search params
  const categorySlug = initialCategorySlug || searchParams.get('category');
  const brandSlug = searchParams.get('brand');
  const search = searchParams.get('search');
  const healthGoal = searchParams.get('goal');
  const minPrice = searchParams.get('min');
  const maxPrice = searchParams.get('max');
  const form = searchParams.get('form');
  const sortBy = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with query parameters
      let url = '/api/products?';
      const params = new URLSearchParams();
      
      if (categorySlug) params.append('categorySlug', categorySlug);
      if (brandSlug) params.append('brandSlug', brandSlug);
      if (search) params.append('search', search);
      if (healthGoal) params.append('healthGoal', healthGoal);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (form) params.append('form', form);
      
      params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      url += params.toString();
      
      console.log('Fetching products from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, brandSlug, search, healthGoal, minPrice, maxPrice, form, sortBy, page, limit]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return {
    products,
    loading,
    error,
    totalPages,
    currentPage: page,
    refreshProducts: fetchProducts
  };
};