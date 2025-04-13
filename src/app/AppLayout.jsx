import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import AuthModal from '@/modules/auth/ui/AuthModal';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleLogin = () => {
    setShowAuthModal(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogin={handleLogin} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <Footer />
      
      {showAuthModal && !user && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="fixed bottom-4 left-4 z-10">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-800"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
};

export default AppLayout;