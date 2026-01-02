import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { Product } from '../../lib/supabase';

interface CartItem extends Product {
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Luxembourg',
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/carrinho');
    }
    setCartItems(cart);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Iniciando processo de pagamento...');
      
      // Validar dados do formulário
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // Validar carrinho
      if (cartItems.length === 0) {
        throw new Error('Seu carrinho está vazio.');
      }

      console.log('✅ Validação concluída');
      console.log('📦 Itens no carrinho:', cartItems.length);

      // Preparar dados para o Stripe
      const paymentData = {
        items: cartItems.map((item) => ({
          name: item.name,
          description: item.description || '',
          price: Math.round(item.price * 100), // Converter para centavos
          quantity: item.quantity,
          image: item.image_url,
        })),
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        },
        successUrl: `${window.location.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/carrinho`,
      };

      console.log('💳 Criando sessão de pagamento Stripe...');
      console.log('📊 Total do pedido: €' + total.toFixed(2));

      // Criar sessão de pagamento Stripe
      const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuração do servidor não encontrada. Entre em contato com o suporte.');
      }

      console.log('📡 Enviando requisição para:', `${supabaseUrl}/functions/v1/create-stripe-checkout`);

      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        
        let errorMessage = 'Erro ao processar pagamento. Tente novamente.';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Erro no servidor (${response.status}). Entre em contato com o suporte via WhatsApp.`;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('📥 Dados recebidos:', responseData);

      const { url } = responseData;

      if (!url) {
        console.error('❌ URL de pagamento não retornada');
        console.error('📥 Resposta completa:', JSON.stringify(responseData, null, 2));
        throw new Error('URL de pagamento não foi retornada. Entre em contato com o suporte via WhatsApp.');
      }

      console.log('✅ URL de pagamento recebida:', url);

      // Salvar informações do pedido no localStorage (SEM AUTENTICAÇÃO)
      localStorage.setItem('pendingOrder', JSON.stringify({
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        total_amount: total,
        items: cartItems,
        created_at: new Date().toISOString(),
      }));

      console.log('💾 Pedido salvo localmente');

      // Limpar carrinho
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
      
      console.log('🔄 Redirecionando para Stripe...');
      
      // Redirecionar IMEDIATAMENTE para Stripe
      window.location.href = url;
      
    } catch (error: any) {
      console.error('💥 Erro ao processar pagamento:', error);
      setError(error.message || 'Erro ao processar pagamento. Por favor, tente novamente ou entre em contato conosco via WhatsApp: +352 XXX XXX XXX');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-black mb-8">
            FINALIZAR <span className="text-gold">COMPRA</span>
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <i className="ri-error-warning-line text-xl"></i>
                <div>
                  <p className="font-semibold mb-1">Erro ao processar pagamento</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-black mb-6">INFORMAÇÕES DE ENTREGA</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        NOME COMPLETO *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          E-MAIL *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          TELEFONE *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                          placeholder="+352 XXX XXX XXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        ENDEREÇO *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                        placeholder="Rua, número, apartamento"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          CIDADE *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                          placeholder="Cidade"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          CÓDIGO POSTAL *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                          placeholder="L-XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          PAÍS *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold disabled:opacity-50"
                        >
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="France">France</option>
                          <option value="Belgium">Belgium</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="Germany">Germany</option>
                          <option value="Italy">Italy</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Sweden">Sweden</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-black mb-6">RESUMO DO PEDIDO</h2>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-black line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-black">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 border-t pt-4">
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
                    <div className="border-t pt-3 flex justify-between text-xl font-bold text-black">
                      <span>TOTAL</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4 whitespace-nowrap flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>PROCESSANDO...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-shopping-bag-3-line text-xl"></i>
                        <span>FINALIZAR COMPRA</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-black mb-2">PAGAMENTO 100% SEGURO</p>
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <i className="ri-visa-line text-3xl text-gray-700"></i>
                      <i className="ri-mastercard-line text-3xl text-gray-700"></i>
                      <div className="px-2 py-1 bg-gray-200 rounded text-xs font-bold text-gray-700">
                        STRIPE
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      🔒 Seus dados estão protegidos com criptografia SSL
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      💳 Pagamento processado via Stripe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
