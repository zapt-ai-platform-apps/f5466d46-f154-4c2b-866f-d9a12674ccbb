import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import ProtectedRoute from './ProtectedRoute';
import LoadingScreen from '@/shared/components/LoadingScreen';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/Products'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/Cart'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const AccountPage = lazy(() => import('./pages/Account'));
const OrdersPage = lazy(() => import('./pages/Orders'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetail'));
const WishlistPage = lazy(() => import('./pages/Wishlist'));
const AdminDashboardPage = lazy(() => import('./pages/admin/Dashboard'));

// Error page
const ErrorPage = lazy(() => import('./pages/Error'));

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: withSuspense(ErrorPage),
    children: [
      {
        index: true,
        element: withSuspense(HomePage)
      },
      {
        path: 'products',
        element: withSuspense(ProductsPage)
      },
      {
        path: 'products/:categorySlug',
        element: withSuspense(ProductsPage)
      },
      {
        path: 'product/:productSlug',
        element: withSuspense(ProductDetailPage)
      },
      {
        path: 'cart',
        element: withSuspense(CartPage)
      },
      {
        path: 'checkout',
        element: withSuspense(CheckoutPage)
      },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            {withSuspense(AccountPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            {withSuspense(OrdersPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'orders/:orderId',
        element: (
          <ProtectedRoute>
            {withSuspense(OrderDetailPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'wishlist',
        element: (
          <ProtectedRoute>
            {withSuspense(WishlistPage)}
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute adminOnly>
            {withSuspense(AdminDashboardPage)}
          </ProtectedRoute>
        )
      }
    ]
  }
]);