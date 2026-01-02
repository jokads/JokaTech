import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    try {
      const formBody = new URLSearchParams();
      formBody.append('name', formData.name);
      formBody.append('email', formData.email);
      formBody.append('phone', formData.phone);
      formBody.append('subject', formData.subject);
      formBody.append('message', formData.message);

      const response = await fetch('https://readdy.ai/api/form/d5bgq09dn6dhfpiabki0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (response.ok) {
        setSubmitMessage('Mensagem enviada com sucesso! Responderemos em breve.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitMessage('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      setSubmitMessage('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-12 sm:pb-20">
        {/* Hero */}
        <div className="bg-black py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              ENTRE EM <span className="text-gold">CONTATO</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Estamos aqui para ajudar. Envie sua mensagem ou use nossos canais diretos.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">ENVIE UMA MENSAGEM</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" data-readdy-form>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    NOME COMPLETO *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm sm:text-base"
                    placeholder="Seu nome"
                  />
                </div>

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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm sm:text-base"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    TELEFONE
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm sm:text-base"
                    placeholder="+352 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    ASSUNTO *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm sm:text-base"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                    <option value="Suporte técnico">Suporte técnico</option>
                    <option value="Pedido e entrega">Pedido e entrega</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Pagamento">Pagamento</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    MENSAGEM *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold resize-none text-sm sm:text-base"
                    placeholder="Descreva sua dúvida ou solicitação..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.message.length}/500 caracteres
                  </p>
                </div>

                {submitMessage && (
                  <div className={`p-4 rounded-lg text-sm ${
                    submitMessage.includes('sucesso') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap text-sm sm:text-base"
                >
                  {loading ? 'ENVIANDO...' : 'ENVIAR MENSAGEM'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">INFORMAÇÕES DE CONTATO</h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Main Contact */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-gold mb-4">CONTATO PRINCIPAL</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <i className="ri-mail-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">E-mail</p>
                        <a href="mailto:jokadas69@gmail.com" className="text-black font-semibold hover:text-gold cursor-pointer text-sm break-all">
                          jokadas69@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="ri-phone-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Telefone</p>
                        <a href="tel:+352621717862" className="text-black font-semibold hover:text-gold cursor-pointer text-sm">
                          +352 621 717 862
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="ri-whatsapp-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">WhatsApp</p>
                        <a href="https://wa.me/352621717862" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:text-gold cursor-pointer text-sm">
                          +352 621 717 862
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-gold mb-4">CONTATO SECUNDÁRIO</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <i className="ri-mail-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">E-mail</p>
                        <a href="mailto:jokadaskz69@gmail.com" className="text-black font-semibold hover:text-gold cursor-pointer text-sm break-all">
                          jokadaskz69@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="ri-phone-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Telefone</p>
                        <a href="tel:+352621377168" className="text-black font-semibold hover:text-gold cursor-pointer text-sm">
                          +352 621 377 168
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <i className="ri-whatsapp-line text-gold text-xl mt-1"></i>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">WhatsApp</p>
                        <a href="https://wa.me/352621377168" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:text-gold cursor-pointer text-sm">
                          +352 621 377 168
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Owners */}
                <div className="bg-gradient-to-br from-gold to-amber-500 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-4">PROPRIETÁRIOS</h3>
                  <div className="space-y-2">
                    <p className="text-black font-semibold text-sm sm:text-base">👤 Claudio Damas</p>
                    <p className="text-black font-semibold text-sm sm:text-base">👤 Mariana Pereira</p>
                    <p className="text-black/80 text-xs sm:text-sm mt-4">
                      📍 Luxemburgo (Vendas Online)
                    </p>
                  </div>
                </div>

                {/* Map */}
                <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2593.8!2d6.1296!3d49.6116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954f7f8f8f8f8f%3A0x8f8f8f8f8f8f8f8f!2sLuxembourg!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Localização Luxemburgo"
                  ></iframe>
                </div>

                {/* Delivery Info */}
                <div className="bg-black p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-bold text-gold mb-4">ENTREGAS</h3>
                  <p className="text-white text-xs sm:text-sm mb-3">
                    Realizamos entregas para toda a Europa:
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    🇱🇺 Luxemburgo • 🇫🇷 França • 🇧🇪 Bélgica • 🇳🇱 Holanda • 🇩🇪 Alemanha • 
                    🇮🇹 Itália • 🇬🇧 Reino Unido • 🇸🇪 Suécia • 🇹🇭 Tailândia e mais
                  </p>
                  <p className="text-red-400 text-xs sm:text-sm mt-3">
                    ❌ Não entregamos para EUA e países em conflito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
