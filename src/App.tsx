import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import CategoryPage from './pages/CategoryPage';
import MarcasPage from './pages/MarcasPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-20 sm:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/registro" element={<AuthLayout><RegisterPage /></AuthLayout>} />
            <Route path="/recuperar-contrasena" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
            <Route path="/restablecer-contrasena" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/productos" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/productos/nuevo" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
            <Route path="/admin/productos/:id" element={<AdminRoute><AdminProductFormPage /></AdminRoute>} />
            <Route path="/admin/pedidos" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/pedidos/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
            <Route path="/admin/mensajes" element={<AdminRoute><AdminMessagesPage /></AdminRoute>} />

            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/productos" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/marcas" element={<Layout><MarcasPage /></Layout>} />
            <Route path="/404" element={<Layout><NotFoundPage /></Layout>} />
            <Route path="/producto/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/carrito" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/cuenta" element={<Layout><AccountPage /></Layout>} />
            <Route path="/cuenta/pedidos" element={<Layout><OrdersPage /></Layout>} />
            <Route path="/cuenta/pedidos/:id" element={<Layout><OrderDetailPage /></Layout>} />

            <Route path="/:categoria" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/:categoria/:subcategoria" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/:categoria/:subcategoria/:tipo" element={<Layout><CategoryPage /></Layout>} />

            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
