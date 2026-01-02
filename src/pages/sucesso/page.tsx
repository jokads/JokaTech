
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase } from '../../lib/supabase';

export default function Sucesso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderSaved, setOrderSaved] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Salvar pedido no banco de dados após pagamento bem-sucedido
    const savePendingOrder = async () => {
      const pendingOrderData = localStorage.getItem('pendingOrder');
      
      if (pendingOrderData && !orderSaved) {
        try {
          const orderData = JSON.parse(pendingOrderData);
          
          const { error } = await supabase
            .from('orders')
            .insert({
              ...orderData,
              status: 'paid',
              stripe_session_id: sessionId,
            });

          if (error) {
            console.error('Erro ao salvar pedido:', error);
          } else {
            // Limpar dados pendentes após salvar
            localStorage.removeItem('pendingOrder');
            setOrderSaved(true);
          }
        } catch (error) {
          console.error('Erro ao processar pedido pendente:', error);
        }
      }
    };

    savePendingOrder();
  }, [sessionId, orderSaved]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-12 mb-8">
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-5xl text-black"></i>
            </div>

            <h1 className="text-5xl font-bold text-black mb-4">
              PAGAMENTO <span className="text-gold">CONFIRMADO!</span>
            </h1>

            <p className="text-xl text-gray-700 mb-8">
              Obrigado pela sua compra! Seu pedido foi processado com sucesso.
            </p>

            {sessionId && (
              <div className="bg-white rounded-lg p-6 mb-8 inline-block">
                <p className="text-sm text-gray-600 mb-2">ID da Transação</p>
                <p className="text-lg font-mono font-semibold text-black break-all">
                  {sessionId}
                </p>
              </div>
            )}

            <div className="space-y-4 text-left max-w-2xl mx-auto mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-mail-line text-black"></i>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Confirmação por E-mail</h3>
                  <p className="text-gray-600">
                    Enviamos um e-mail de confirmação com todos os detalhes do seu pedido.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-truck-line text-black"></i>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Preparação do Envio</h3>
                  <p className="text-gray-600">
                    Seu pedido será preparado e enviado em até 2 dias úteis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-customer-service-line text-black"></i>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">Suporte Disponível</h3>
                  <p className="text-gray-600">
                    Qualquer dúvida, entre em contato pelo WhatsApp: +352 621 377 168
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
              >
                VOLTAR À PÁGINA INICIAL
              </button>
              <button
                onClick={() => navigate('/produtos')}
                className="px-8 py-4 bg-black text-gold font-bold rounded-lg hover:bg-gray-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                CONTINUAR COMPRANDO
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              PRÓXIMOS PASSOS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-gold mb-2">1</div>
                <h3 className="font-bold text-black mb-2">Confirmação</h3>
                <p className="text-sm text-gray-600">
                  Verifique seu e-mail para detalhes do pedido
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">2</div>
                <h3 className="font-bold text-black mb-2">Preparação</h3>
                <p className="text-sm text-gray-600">
                  Preparamos e testamos seu pedido
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-gold mb-2">3</div>
                <h3 className="font-bold text-black mb-2">Entrega</h3>
                <p className="text-sm text-gray-600">
                  Receba em casa com rastreamento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
