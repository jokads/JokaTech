import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20tech%20company%20office%20with%20premium%20computer%20hardware%20components%20displayed%2C%20professional%20business%20environment%2C%20black%20and%20gold%20color%20scheme%2C%20luxury%20technology%20showcase%2C%20clean%20minimalist%20design&width=1920&height=600&seq=abouthero1&orientation=landscape"
              alt="Sobre JokaTech"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/50"></div>
          </div>

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                SOBRE A <span className="text-gold">JOKATECH</span>
              </h1>
              <p className="text-white text-lg">
                Sua loja de confiança para componentes premium de PC
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                NOSSA <span className="text-gold">HISTÓRIA</span>
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A JokaTech nasceu da paixão por tecnologia e do desejo de oferecer aos entusiastas 
                  de PC os melhores componentes de hardware do mercado. Fundada por <strong className="text-gold">Claudio Damas</strong> e 
                  <strong className="text-gold"> Mariana Pereira</strong>, nossa missão é democratizar o acesso a componentes 
                  premium com preços justos e atendimento excepcional.
                </p>
                <p>
                  Baseados em <strong className="text-gold">Luxemburgo</strong>, operamos exclusivamente online, permitindo 
                  que possamos oferecer os melhores preços sem os custos de uma loja física. Isso nos 
                  permite investir mais em estoque diversificado e em um atendimento personalizado.
                </p>
                <p>
                  Realizamos entregas para toda a Europa, incluindo França, Bélgica, Holanda, Alemanha, 
                  Itália, Reino Unido, Suécia e muitos outros países. Nossa logística é otimizada para 
                  garantir que seus produtos cheguem rapidamente e em perfeito estado.
                </p>
              </div>
            </div>

            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20business%20partners%20working%20together%20in%20modern%20tech%20office%2C%20two%20people%20collaborating%20on%20computer%20hardware%20business%2C%20clean%20professional%20environment%2C%20natural%20lighting%2C%20business%20success&width=600&height=600&seq=founders1&orientation=squarish"
                alt="Fundadores"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-black text-center mb-12">
              NOSSOS <span className="text-gold">VALORES</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                  <i className="ri-shield-check-line text-3xl text-black"></i>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">QUALIDADE GARANTIDA</h3>
                <p className="text-gray-600">
                  Trabalhamos apenas com marcas reconhecidas e produtos originais com garantia do fabricante.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                  <i className="ri-customer-service-2-line text-3xl text-black"></i>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">SUPORTE DEDICADO</h3>
                <p className="text-gray-600">
                  Nossa equipe está sempre disponível para ajudar você a escolher os melhores componentes.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gold rounded-full mx-auto mb-4">
                  <i className="ri-price-tag-3-line text-3xl text-black"></i>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">PREÇOS JUSTOS</h3>
                <p className="text-gray-600">
                  Sem intermediários, oferecemos os melhores preços do mercado europeu.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-black text-center mb-12">
              CONHEÇA OS <span className="text-gold">FUNDADORES</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-gold to-amber-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <i className="ri-user-line text-8xl text-gold"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Claudio Damas</h3>
                <p className="text-gold font-semibold mb-3">Co-Fundador & CEO</p>
                <p className="text-gray-600">
                  Especialista em hardware com mais de 10 anos de experiência no mercado de tecnologia.
                </p>
              </div>

              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-gold to-amber-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <i className="ri-user-line text-8xl text-gold"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Mariana Pereira</h3>
                <p className="text-gold font-semibold mb-3">Co-Fundadora & COO</p>
                <p className="text-gray-600">
                  Gestora de operações com expertise em logística e atendimento ao cliente.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-black rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              JOKATECH EM <span className="text-gold">NÚMEROS</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-gold mb-2">50K+</p>
                <p className="text-gray-400">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-gold mb-2">500+</p>
                <p className="text-gray-400">Produtos Disponíveis</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-gold mb-2">15+</p>
                <p className="text-gray-400">Países Atendidos</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-gold mb-2">4.9★</p>
                <p className="text-gray-400">Avaliação Média</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-black mb-6">
              PRONTO PARA COMEÇAR?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Entre em contato conosco e descubra como podemos ajudar você a montar o PC perfeito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contato"
                className="px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
              >
                FALE CONOSCO
              </a>
              <a
                href="/produtos"
                className="px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                VER PRODUTOS
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
