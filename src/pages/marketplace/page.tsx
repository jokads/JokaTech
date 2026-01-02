import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase } from '../../lib/supabase';

export default function Marketplace() {
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSellerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage('Você precisa estar logado para se tornar vendedor');
        return;
      }

      const { error } = await supabase.from('sellers').insert({
        user_id: user.id,
        business_name: businessName,
        description,
      });

      if (error) throw error;

      setMessage('Solicitação enviada! Aguarde aprovação da equipe JokaTech.');
      setBusinessName('');
      setDescription('');
      setShowSellerForm(false);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20e-commerce%20marketplace%20with%20multiple%20vendors%20selling%20tech%20products%2C%20digital%20shopping%20platform%20interface%2C%20clean%20professional%20design%2C%20black%20and%20gold%20color%20scheme%2C%20technology%20showcase&width=1920&height=600&seq=marketplacehero1&orientation=landscape"
              alt="Marketplace"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
          </div>

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                MARKETPLACE <span className="text-gold">JOKATECH</span>
              </h1>
              <p className="text-white text-lg mb-6">
                Compre de vendedores verificados ou venda seus próprios produtos tech
              </p>
              <button
                onClick={() => setShowSellerForm(true)}
                className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
              >
                TORNAR-SE VENDEDOR
              </button>
            </div>
          </div>
        </div>

        {/* Seller Registration Form */}
        {showSellerForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-lg max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Tornar-se Vendedor</h2>
                <button
                  onClick={() => setShowSellerForm(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleSellerRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Nome do Negócio
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="Sua loja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold resize-none"
                    placeholder="Conte-nos sobre seus produtos..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 caracteres
                  </p>
                </div>

                {message && (
                  <div className="p-4 bg-gold/20 text-black rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR SOLICITAÇÃO'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-black text-center mb-12">
            POR QUE VENDER NA JOKATECH?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                <i className="ri-shield-check-line text-3xl text-black"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Segurança Total</h3>
              <p className="text-gray-600">
                Pagamentos seguros e proteção para compradores e vendedores
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                <i className="ri-group-line text-3xl text-black"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Grande Audiência</h3>
              <p className="text-gray-600">
                Acesso a milhares de compradores interessados em tech
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                <i className="ri-percent-line text-3xl text-black"></i>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Comissão Justa</h3>
              <p className="text-gray-600">Entre 1% e 5% de comissão por venda realizada</p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-black py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              COMO FUNCIONA
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-gold text-black font-bold text-xl rounded-full mx-auto mb-4">
                  1
                </div>
                <h3 className="text-white font-bold mb-2">Cadastre-se</h3>
                <p className="text-gray-400 text-sm">
                  Preencha o formulário de vendedor
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-gold text-black font-bold text-xl rounded-full mx-auto mb-4">
                  2
                </div>
                <h3 className="text-white font-bold mb-2">Aprovação</h3>
                <p className="text-gray-400 text-sm">
                  Nossa equipe analisa sua solicitação
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-gold text-black font-bold text-xl rounded-full mx-auto mb-4">
                  3
                </div>
                <h3 className="text-white font-bold mb-2">Liste Produtos</h3>
                <p className="text-gray-400 text-sm">
                  Adicione seus produtos ao marketplace
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-gold text-black font-bold text-xl rounded-full mx-auto mb-4">
                  4
                </div>
                <h3 className="text-white font-bold mb-2">Venda!</h3>
                <p className="text-gray-400 text-sm">
                  Receba pagamentos automaticamente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            PRONTO PARA COMEÇAR?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Junte-se a centenas de vendedores de sucesso na JokaTech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSellerForm(true)}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
            >
              TORNAR-SE VENDEDOR
            </button>
            <Link
              to="/produtos"
              className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              EXPLORAR PRODUTOS
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
