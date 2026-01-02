import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase, Product } from '../../lib/supabase';

export default function Home() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    usage: '',
    games: '',
    budget: ''
  });

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(6);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setFeaturedProducts(data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos em destaque:', error);
    } finally {
      setLoading(false);
    }
  };

  const preMadeBuilds = [
    {
      name: 'PC Gamer Entry',
      specs: 'Intel i5-12400F • RTX 3060 • 16GB RAM • 500GB SSD',
      fps: '120 FPS em Warzone',
      price: '€899',
      image: 'https://readdy.ai/api/search-image?query=compact%20gaming%20PC%20tower%20with%20blue%20RGB%20lighting%20and%20tempered%20glass%20side%20panel%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20entry-level%20gaming%20computer%2C%20modern%20sleek%20design%20showcase&width=400&height=500&seq=pcentry1&orientation=portrait',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      name: 'PC Gamer Mid',
      specs: 'Intel i7-13700K • RTX 4070 • 32GB RAM • 1TB SSD',
      fps: '165 FPS em Warzone',
      price: '€1.499',
      image: 'https://readdy.ai/api/search-image?query=mid-tower%20gaming%20PC%20with%20purple%20and%20gold%20RGB%20lighting%2C%20tempered%20glass%20panels%2C%20visible%20high-end%20components%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20premium%20gaming%20computer%20showcase&width=400&height=500&seq=pcmid1&orientation=portrait',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      name: 'PC Gamer High-End',
      specs: 'Intel i9-14900K • RTX 4090 • 64GB RAM • 2TB SSD',
      fps: '240+ FPS em Warzone',
      price: '€3.299',
      image: 'https://readdy.ai/api/search-image?query=premium%20full-tower%20gaming%20PC%20with%20golden%20RGB%20lighting%2C%20triple%20tempered%20glass%20panels%2C%20water%20cooling%20system%20visible%2C%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20ultra%20high-end%20gaming%20computer%2C%20luxury%20showcase&width=400&height=500&seq=pchigh1&orientation=portrait',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      name: 'PC Trabalho',
      specs: 'Intel i7-13700 • RTX 4060 • 32GB RAM • 1TB SSD',
      fps: 'Ideal para edição e design',
      price: '€1.299',
      image: 'https://readdy.ai/api/search-image?query=professional%20workstation%20PC%20tower%20with%20minimal%20white%20and%20gold%20lighting%2C%20clean%20design%2C%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20business%20computer%2C%20elegant%20modern%20showcase&width=400&height=500&seq=pcwork1&orientation=portrait',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      name: 'PC IA & Rendering',
      specs: 'AMD Ryzen 9 7950X • RTX 4090 • 128GB RAM • 4TB SSD',
      fps: 'Otimizado para IA e renderização',
      price: '€4.499',
      image: 'https://readdy.ai/api/search-image?query=high-performance%20AI%20workstation%20PC%20with%20advanced%20cooling%20system%2C%20multiple%20GPUs%20visible%2C%20gold%20accent%20lighting%2C%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20professional%20computing%20powerhouse%20showcase&width=400&height=500&seq=pcai1&orientation=portrait',
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const productShowcase = [
    {
      title: 'GPUs de Última Geração',
      description: 'Placas de vídeo RTX 4090, 4080, 4070 com ray tracing e DLSS 3.0',
      image: 'https://readdy.ai/api/search-image?query=NVIDIA%20RTX%204090%20graphics%20card%20with%20RGB%20lighting%20rotating%20showcase%2C%20premium%20GPU%20with%20golden%20accents%20on%20dark%20background%2C%20professional%20studio%20photography%2C%20dramatic%20lighting%2C%20high-end%20graphics%20card%20display%2C%20animated%20product%20showcase&width=600&height=400&seq=rtx4090showcase&orientation=landscape',
      link: '/produtos?category=GPU'
    },
    {
      title: 'Torres Premium',
      description: 'Gabinetes com vidro temperado, RGB e excelente fluxo de ar',
      image: 'https://readdy.ai/api/search-image?query=premium%20gaming%20PC%20tower%20case%20with%20tempered%20glass%20and%20RGB%20lighting%2C%20black%20case%20with%20golden%20accents%2C%20professional%20studio%20photography%2C%20dramatic%20lighting%2C%20modern%20PC%20case%20showcase%2C%20animated%20display&width=600&height=400&seq=towercase showcase&orientation=landscape',
      link: '/produtos?category=Torre'
    },
    {
      title: 'Monitores Gaming',
      description: 'Monitores 4K, 144Hz-240Hz, HDR para máxima imersão',
      image: 'https://readdy.ai/api/search-image?query=curved%20gaming%20monitor%204K%20with%20vibrant%20display%20showing%20game%20graphics%2C%20black%20monitor%20with%20golden%20stand%2C%20professional%20studio%20photography%2C%20dramatic%20lighting%2C%20premium%20gaming%20monitor%20showcase%2C%20animated%20display&width=600&height=400&seq=monitorshowcase&orientation=landscape',
      link: '/produtos?category=Monitor'
    }
  ];

  const comparisons = [
    {
      title: 'RTX 3060 vs RTX 4060',
      specs: [
        { label: 'Warzone (1080p)', rtx3060: '90 FPS', rtx4060: '120 FPS' },
        { label: 'Consumo', rtx3060: '170W', rtx4060: '115W' },
        { label: 'Preço', rtx3060: '€299', rtx4060: '€349' },
        { label: 'Indicação', rtx3060: 'Custo-benefício', rtx4060: 'Melhor performance' }
      ]
    },
    {
      title: 'Intel i5 vs AMD Ryzen 5',
      specs: [
        { label: 'Gaming', rtx3060: 'Excelente', rtx4060: 'Excelente' },
        { label: 'Multitarefa', rtx3060: 'Bom', rtx4060: 'Muito Bom' },
        { label: 'Preço', rtx3060: '€199', rtx4060: '€189' },
        { label: 'Indicação', rtx3060: 'Gaming puro', rtx4060: 'Uso misto' }
      ]
    }
  ];

  const bundles = [
    {
      name: 'Kit GPU + Fonte',
      items: 'RTX 4070 + Fonte 750W Gold',
      price: '€649',
      savings: 'Economize €50',
      image: 'https://readdy.ai/api/search-image?query=graphics%20card%20RTX%204070%20next%20to%20gold-rated%20power%20supply%20unit%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20gaming%20hardware%20bundle%2C%20premium%20components%20showcase&width=400&height=300&seq=bundle1&orientation=landscape'
    },
    {
      name: 'Setup Completo',
      items: 'PC Gamer + Monitor 144Hz + Periféricos',
      price: '€1.299',
      savings: 'Economize €150',
      image: 'https://readdy.ai/api/search-image?query=complete%20gaming%20setup%20with%20PC%20tower%2C%20curved%20monitor%2C%20RGB%20keyboard%20and%20mouse%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20full%20gaming%20bundle%20showcase&width=400&height=300&seq=bundle2&orientation=landscape'
    },
    {
      name: 'Kit Streamer Pro',
      items: 'PC + Webcam 4K + Microfone + Iluminação',
      price: '€1.899',
      savings: 'Economize €200',
      image: 'https://readdy.ai/api/search-image?query=professional%20streaming%20setup%20with%20gaming%20PC%2C%204K%20webcam%2C%20studio%20microphone%2C%20ring%20light%20on%20simple%20dark%20gradient%20background%2C%20professional%20product%20photography%2C%20studio%20lighting%2C%20content%20creator%20bundle%20showcase&width=400&height=300&seq=bundle3&orientation=landscape'
    }
  ];

  const trustBadges = [
    { icon: 'ri-shield-check-line', title: 'Garantia Estendida', desc: 'Até 3 anos de cobertura' },
    { icon: 'ri-test-tube-line', title: 'Testado Antes do Envio', desc: '100% dos produtos testados' },
    { icon: 'ri-customer-service-2-line', title: 'Suporte Pós-Venda', desc: 'Equipe especializada 24/7' },
    { icon: 'ri-secure-payment-line', title: 'Pagamento Seguro', desc: 'Visa, Mastercard, PayPal' }
  ];

  const howItWorks = [
    { step: '1', icon: 'ri-search-line', title: 'Escolhe o Produto', desc: 'Navegue pelo catálogo ou use nosso quiz' },
    { step: '2', icon: 'ri-message-3-line', title: 'Faz Contato', desc: 'WhatsApp, email ou chat online' },
    { step: '3', icon: 'ri-bank-card-line', title: 'Pagamento', desc: 'Seguro via Stripe (Visa/Mastercard)' },
    { step: '4', icon: 'ri-truck-line', title: 'Envio/Entrega', desc: 'Entrega rápida em toda Europa' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://readdy.ai/api/search-image?query=premium%20high-end%20gaming%20PC%20components%20with%20RGB%20lighting%2C%20graphics%20card%20and%20motherboard%20on%20dark%20gradient%20background%20with%20circuit%20patterns%2C%20professional%20studio%20photography%2C%20luxury%20technology%20showcase%2C%20dramatic%20lighting%2C%20sleek%20modern%20design%2C%20black%20and%20gold%20color%20scheme&width=1920&height=1080&seq=heromain1&orientation=landscape"
            alt="Premium PC Components"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 animate-slide-up">
              <span className="text-gold block">PCS E COMPONENTES</span>
              <span className="text-white block">Desempenho Real, Preço Justo</span>
            </h1>

            <p className="text-gold text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed font-semibold animate-slide-up" style={{animationDelay: '0.2s'}}>
              Montagens testadas, garantia estendida e suporte pós-venda especializado. Construa o PC dos seus sonhos com os melhores componentes do mercado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Link 
                to="/contato" 
                className="inline-flex justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gold text-black font-semibold rounded-lg hover:bg-white hover:scale-105 transition-all items-center space-x-3 group whitespace-nowrap cursor-pointer"
              >
                <span>PEDIR ORÇAMENTO</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </Link>
              <a 
                href="https://wa.me/352621717862" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all items-center space-x-3 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-whatsapp-line text-xl"></i>
                <span>FALE CONOSCO</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase de Produtos em Destaque */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              NOSSOS <span className="text-gold">PRODUTOS EM DESTAQUE</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Componentes premium para o seu setup perfeito</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productShowcase.map((product, index) => (
              <Link 
                key={index} 
                to={product.link}
                className="group cursor-pointer animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative rounded-xl overflow-hidden bg-black border-2 border-gold/30 hover:border-gold hover:scale-105 transition-all duration-300">
                  <div className="relative w-full h-64">
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/50">
                        <i className="ri-arrow-right-line text-3xl text-black"></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-b from-gray-900 to-black">
                    <h3 className="text-white text-lg font-bold mb-2">{product.title}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PCs Pré-Montados */}
      <section className="py-12 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              PCS PRONTOS PARA <span className="text-gold">JOGAR / TRABALHAR</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Configurações testadas e otimizadas para máximo desempenho</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6" data-product-shop>
            {preMadeBuilds.map((build, index) => (
              <div key={index} className="bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden border border-gold/30 hover:border-gold transition-all hover:shadow-lg hover:shadow-gold/50 group">
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={build.image}
                    alt={build.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-2">{build.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 leading-relaxed">{build.specs}</p>
                  <div className="flex items-center space-x-2 mb-4">
                    <i className="ri-speed-line text-gold"></i>
                    <p className="text-gold text-xs sm:text-sm font-semibold">{build.fps}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gold text-2xl sm:text-3xl font-bold">{build.price}</p>
                    <Link 
                      to="/contato"
                      className="px-3 sm:px-4 py-2 bg-gold text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      PEDIR
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparações */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              COMPARAÇÕES <span className="text-gold">SIMPLES</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Escolha o melhor componente para suas necessidades</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {comparisons.map((comparison, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gold/20 p-4 sm:p-6 hover:border-gold transition-all">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">{comparison.title}</h3>
                <div className="space-y-3 sm:space-y-4">
                  {comparison.specs.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                      <div className="text-gray-700 font-semibold text-sm sm:text-base">{spec.label}</div>
                      <div className="text-center px-2 sm:px-3 py-1 sm:py-2 bg-gold/10 rounded text-xs sm:text-sm font-semibold">{spec.rtx3060}</div>
                      <div className="text-center px-2 sm:px-3 py-1 sm:py-2 bg-gold/20 rounded text-xs sm:text-sm font-semibold">{spec.rtx4060}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Rápido */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              ENCONTRE SEU <span className="text-gold">PC IDEAL</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Responda 3 perguntas rápidas e receba uma sugestão personalizada</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 border border-gold/30">
            {quizStep === 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Para que vai usar o PC?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Gaming', 'Trabalho/Estudo', 'Edição de Vídeo', 'Streaming'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, usage: option});
                        setQuizStep(1);
                      }}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gold/10 hover:bg-gold text-white hover:text-black font-semibold rounded-lg transition-all cursor-pointer text-sm sm:text-base"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 1 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quais jogos pretende jogar?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Jogos leves (LoL, CS:GO)', 'Jogos médios (Fortnite, Valorant)', 'Jogos pesados (Warzone, Cyberpunk)', 'Não jogo'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, games: option});
                        setQuizStep(2);
                      }}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gold/10 hover:bg-gold text-white hover:text-black font-semibold rounded-lg transition-all cursor-pointer text-sm sm:text-base"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Qual seu orçamento?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {['Até €800', '€800 - €1.500', '€1.500 - €2.500', 'Acima de €2.500'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswers({...quizAnswers, budget: option});
                        setQuizStep(3);
                      }}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gold/10 hover:bg-gold text-white hover:text-black font-semibold rounded-lg transition-all cursor-pointer text-sm sm:text-base"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="text-center">
                <i className="ri-checkbox-circle-line text-6xl sm:text-7xl text-gold mb-4 sm:mb-6"></i>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Sugestão Personalizada!</h3>
                <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                  Com base nas suas respostas, recomendamos o <span className="text-gold font-bold">PC Gamer Mid</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href={`https://wa.me/352621717862?text=Olá! Fiz o quiz e gostaria de receber a sugestão personalizada: ${quizAnswers.usage}, ${quizAnswers.games}, ${quizAnswers.budget}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line text-xl"></i>
                    <span>FALE CONOSCO</span>
                  </a>
                  <button
                    onClick={() => setQuizStep(0)}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gold/10 text-gold font-semibold rounded-lg hover:bg-gold hover:text-black transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap"
                  >
                    REFAZER QUIZ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Provas de Confiança */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gold/20 hover:border-gold transition-all">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                  <i className={`${badge.icon} text-2xl sm:text-3xl text-gold`}></i>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black mb-2">{badge.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-12 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              COMO <span className="text-gold">FUNCIONA</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Processo simples em 4 passos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gold/30 hover:border-gold transition-all text-center">
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gold text-black font-bold rounded-full flex items-center justify-center text-base sm:text-lg">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 mt-2 sm:mt-4 flex items-center justify-center bg-gold/10 rounded-full">
                    <i className={`${step.icon} text-2xl sm:text-3xl text-gold`}></i>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{step.desc}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gold/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kits Prontos */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              KITS <span className="text-gold">PRONTOS</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Pacotes completos com desconto especial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-product-shop>
            {bundles.map((bundle, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden border-2 border-gold/20 hover:border-gold transition-all group">
                <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                  <img 
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full">
                    {bundle.savings}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-2">{bundle.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{bundle.items}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-gold">{bundle.price}</p>
                    <Link 
                      to="/contato"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gold text-black font-semibold rounded-lg hover:bg-black hover:text-gold transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap"
                    >
                      PEDIR PACOTE
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - AMPLIADO */}
      <section className="py-12 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-16">
            DESTAQUES DA SEMANA <span className="text-gold">🔥</span>
          </h2>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4">Carregando produtos...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-lg">Nenhum produto em destaque no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-product-shop>
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/produto/${product.id}`}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative w-full h-80 sm:h-96">
                    <img 
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 px-3 sm:px-4 py-1 sm:py-2 bg-gold text-black text-xs font-bold rounded-full">
                      DESTAQUE
                    </div>

                    {hoveredProduct === product.id && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 sm:p-6 transition-all">
                        <p className="text-white text-center text-sm">{product.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3">{product.brand}</p>
                    <p className="text-gold text-2xl sm:text-3xl font-bold">€{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/produtos"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-white transition-all cursor-pointer whitespace-nowrap"
            >
              <span>VER TODOS OS PRODUTOS</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://readdy.ai/api/search-image?query=wide%20panoramic%20view%20of%20premium%20gaming%20PC%20setup%20with%20golden%20RGB%20lighting%2C%20multiple%20monitors%2C%20high-end%20components%20visible%2C%20dark%20room%20with%20ambient%20glow%2C%20professional%20photography%2C%20luxury%20gaming%20station%2C%20dramatic%20lighting%2C%20black%20and%20gold%20color%20scheme&width=1920&height=1080&seq=ctasetup1&orientation=landscape"
            alt="Monte seu PC"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gold mb-6 sm:mb-8">
            MONTE SEU PC DOS SONHOS
          </h2>
          <p className="text-white text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl">
            Configurações personalizadas • Montagem profissional incluída • Garantia estendida
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/produtos" 
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gold text-black font-semibold rounded-lg hover:bg-white transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap"
            >
              CONFIGURAR AGORA
            </Link>
            <a 
              href="https://wa.me/352621717862" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all cursor-pointer flex items-center justify-center space-x-2 text-sm sm:text-base whitespace-nowrap"
            >
              <i className="ri-whatsapp-line text-xl"></i>
              <span>FALAR COM ESPECIALISTA</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
