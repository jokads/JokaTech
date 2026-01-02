import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    updateCartCount();
    checkAuthStatus();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, [location]);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  const checkAuthStatus = () => {
    const adminStatus = localStorage.getItem('isAdmin');
    const adminEmail = localStorage.getItem('adminEmail');
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const loggedEmail = localStorage.getItem('userEmail');
    
    // Verificar se é admin autorizado
    const authorizedEmails = ['damasclaudio2@gmail.com', 'marianapesimoes@gmail.com'];
    const isAuthorizedAdmin = adminStatus === 'true' && adminEmail && authorizedEmails.includes(adminEmail);
    
    setIsAdmin(isAuthorizedAdmin);
    setIsLoggedIn(isAuthorizedAdmin || userLoggedIn === 'true');
    setUserEmail(adminEmail || loggedEmail || '');
  };

  const handleLogout = () => {
    // Limpar todos os dados de autenticação
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
    
    // Redirecionar para home
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gold rounded-lg">
              <i className="ri-cpu-line text-xl sm:text-2xl text-black"></i>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gold">
              Joka<span className="text-white">Tech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              INÍCIO
            </Link>
            <Link to="/produtos" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              PRODUTOS
            </Link>
            <Link to="/montar-pc" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              MONTAR PC
            </Link>
            <Link to="/marketplace" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              MARKETPLACE
            </Link>
            <Link to="/sobre" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              SOBRE
            </Link>
            <Link to="/contato" className="text-white hover:text-gold transition-colors cursor-pointer font-medium text-sm">
              CONTATO
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dashboard - Só para admins autorizados */}
            {isAdmin && (
              <Link
                to="/dashboard"
                className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap items-center space-x-2 text-sm"
              >
                <i className="ri-dashboard-line"></i>
                <span>ADMIN</span>
              </Link>
            )}

            {/* Carrinho */}
            <Link
              to="/carrinho"
              className="relative w-10 h-10 flex items-center justify-center text-gold hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-shopping-cart-line text-xl sm:text-2xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login/Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap items-center space-x-2 text-sm"
              >
                <i className="ri-logout-box-line"></i>
                <span>SAIR</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap text-sm"
              >
                LOGIN
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gold hover:text-white transition-colors cursor-pointer"
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/98 backdrop-blur-sm border-t border-gold/20 shadow-xl">
          <div className="px-6 py-6 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              INÍCIO
            </Link>
            <Link
              to="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              PRODUTOS
            </Link>
            <Link
              to="/montar-pc"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              MONTAR PC
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              MARKETPLACE
            </Link>
            <Link
              to="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              SOBRE
            </Link>
            <Link
              to="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white hover:text-gold transition-colors cursor-pointer font-medium py-2"
            >
              CONTATO
            </Link>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gold/20 space-y-3">
              {isAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-semibold rounded-lg text-center"
                >
                  <i className="ri-dashboard-line mr-2"></i>
                  DASHBOARD ADMIN
                </Link>
              )}
              
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg text-center"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  SAIR
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-gold text-black font-semibold rounded-lg text-center"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Flutuante */}
      <a
        href="https://wa.me/352621717862"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer group"
      >
        <i className="ri-whatsapp-line text-3xl sm:text-4xl text-white"></i>
        <span className="hidden sm:block absolute right-20 bg-black text-gold px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-sm">
          Fale Conosco
        </span>
      </a>
    </nav>
  );
}
