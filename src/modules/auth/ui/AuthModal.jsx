import React, { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/supabaseClient';

const AuthModal = ({ onClose }) => {
  const [view, setView] = useState('magic_link');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign in with ZAPT</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-center mb-2">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ZAPT - Build apps with AI
            </a>
          </div>
          
          <Auth
            supabaseClient={supabase}
            providers={['google', 'facebook', 'apple']}
            view={view}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F46E5',
                    brandAccent: '#4338CA',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Create a password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: 'Don\'t have an account? Sign up',
                  confirmation_text: 'Check your email for the confirmation link',
                },
                magic_link: {
                  email_input_label: 'Email address',
                  email_input_placeholder: 'Your email address',
                  button_label: 'Send magic link',
                  loading_button_label: 'Sending magic link...',
                  link_text: 'Send a magic link email',
                  confirmation_text: 'Check your email for the magic link',
                },
              },
            }}
          />
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={onClose} 
            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;