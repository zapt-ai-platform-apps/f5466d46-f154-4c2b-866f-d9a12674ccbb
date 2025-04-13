import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthCart</h3>
            <p className="text-gray-400 mb-4">
              Premium health supplements, proteins, vitamins, and nutrition products for your wellness journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link to="/products/proteins" className="text-gray-400 hover:text-white">Proteins</Link></li>
              <li><Link to="/products/vitamins" className="text-gray-400 hover:text-white">Vitamins</Link></li>
              <li><Link to="/products/weight-loss" className="text-gray-400 hover:text-white">Weight Loss</Link></li>
              <li><Link to="/products/fitness" className="text-gray-400 hover:text-white">Fitness Accessories</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-400 hover:text-white">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white">Order History</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-gray-400" />
                <span className="text-gray-400">123 Wellness Street, Healthy City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-gray-400" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-3 text-gray-400" />
                <a href="mailto:support@healthcart.com" className="text-gray-400 hover:text-white">support@healthcart.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} HealthCart. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;