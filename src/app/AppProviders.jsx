import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

const AppProviders = () => {
  return <RouterProvider router={router} />;
};

export default AppProviders;