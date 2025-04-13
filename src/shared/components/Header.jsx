import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import SearchBar from './SearchBar';
import { FiUser, FiShoppingCart, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/modules/cart/hooks/useCart';

const Header = ({ onLogin }) => {
  const { user, signOut } = useAuth();
  const { cartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
              alt="HealthCart Logo" 
              className="h-10 w-10 mr-3"
            />
            <span className="text-xl font-bold text-gray-800">HealthCart</span>
          </Link>

          {/* Search bar - hide on mobile */}
          <div className="hidden md:block w-full md:w-1/3 lg:w-2/5 mx-4">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                  <FiUser className="w-6 h-6" />
                  <span className="ml-1 hidden md:block">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                  <div className="py-2">
                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</Link>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={onLogin} className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer">
                <FiUser className="w-6 h-6" />
                <span className="ml-1 hidden md:block">Sign In</span>
              </button>
            )}

            <Link to="/wishlist" className="text-gray-700 hover:text-blue-600">
              <FiHeart className="w-6 h-6" />
            </Link>

            <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
              <FiShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-blue-600 cursor-pointer">
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-100 py-3 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8">
            {isLoading ? (
              <li className="text-gray-600">Loading categories...</li>
            ) : (
              categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/products/${category.slug}`} className="text-gray-600 hover:text-blue-600">
                    {category.name}
                  </Link>
                </li>
              ))
            )}
            <li>
              <Link to="/products" className="text-gray-600 hover:text-blue-600">
                All Products
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-3">
              {isLoading ? (
                <li className="text-gray-600">Loading categories...</li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      to={`/products/${category.slug}`} 
                      className="block text-gray-600 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              )}
              <li>
                <Link 
                  to="/products" 
                  className="block text-gray-600 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;