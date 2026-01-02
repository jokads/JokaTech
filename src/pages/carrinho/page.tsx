
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { Product } from '../../lib/supabase';

interface CartItem extends Product {
  quantity: number;
}

export default function Carrinho() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const cart = JSON.parse(cartData);
          if (Array.isArray(cart)) {
            setCartItems(cart);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    try {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock || 999, newQuantity)) } : item
      );
      setCartItems(updatedCart);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const removeItem = (id: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    try {
      navigate('/checkout');
    } catch (error) {
      console.error('Error navigating to checkout:', error);
      window.location.href = '/checkout';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-black mb-8">
            CARRINHO DE <span className="text-gold">COMPRAS</span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg mb-6">Seu carrinho está vazio</p>
              <Link
                to="/produtos"
                className="inline-block px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
              >
                CONTINUAR COMPRANDO
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-6 flex items-center space-x-6">
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/produto/${item.id}`}
                        className="text-lg font-semibold text-black hover:text-gold cursor-pointer"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{item.brand}</p>
                      <p className="text-xl font-bold text-black mt-2">€{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-100 cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <span className="text-lg font-semibold text-black w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded hover:bg-gray-100 cursor-pointer"
                        disabled={item.stock !== undefined && item.quantity >= item.stock}
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-black mb-2">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-black mb-6">RESUMO DO PEDIDO</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Envio</span>
                      <span className="font-semibold">
                        {shipping === 0 ? 'GRÁTIS' : `€${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-sm text-green-600">✓ Envio grátis em compras acima de €100</p>
                    )}
                    <div className="border-t pt-4 flex justify-between text-xl font-bold text-black">
                      <span>TOTAL</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer mb-4 whitespace-nowrap"
                  >
                    FINALIZAR COMPRA
                  </button>

                  <Link
                    to="/produtos"
                    className="block text-center text-black hover:text-gold cursor-pointer"
                  >
                    Continuar comprando
                  </Link>

                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm font-semibold text-black mb-3">PAGAMENTO SEGURO</p>
                    <div className="flex items-center space-x-3">
                      <i className="ri-visa-line text-3xl text-gray-700"></i>
                      <i className="ri-mastercard-line text-3xl text-gray-700"></i>
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-xs font-bold text-gray-700">
                        PP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
