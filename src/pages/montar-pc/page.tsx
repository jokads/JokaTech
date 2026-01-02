import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase } from '../../lib/supabase';

interface Component {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

export default function MontarPC() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Componentes disponíveis
  const [cpus, setCpus] = useState<Component[]>([]);
  const [gpus, setGpus] = useState<Component[]>([]);
  const [rams, setRams] = useState<Component[]>([]);
  const [motherboards, setMotherboards] = useState<Component[]>([]);
  const [storage, setStorage] = useState<Component[]>([]);
  const [cases, setCases] = useState<Component[]>([]);
  const [psus, setPsus] = useState<Component[]>([]);
  const [cooling, setCooling] = useState<Component[]>([]);

  // Seleções do usuário
  const [selectedCPU, setSelectedCPU] = useState<Component | null>(null);
  const [selectedGPU, setSelectedGPU] = useState<Component | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<Component | null>(null);
  const [includeRAM, setIncludeRAM] = useState(true);
  const [selectedMotherboard, setSelectedMotherboard] = useState<Component | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<Component | null>(null);
  const [selectedCase, setSelectedCase] = useState<Component | null>(null);
  const [selectedPSU, setSelectedPSU] = useState<Component | null>(null);
  const [selectedCooling, setSelectedCooling] = useState<Component | null>(null);

  // Informações do cliente
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price, image_url, category')
        .in('category', ['CPU', 'GPU', 'RAM', 'Motherboard', 'SSD', 'Torre', 'Fonte', 'Refrigeração']);

      if (products) {
        setCpus(products.filter(p => p.category === 'CPU'));
        setGpus(products.filter(p => p.category === 'GPU'));
        setRams(products.filter(p => p.category === 'RAM'));
        setMotherboards(products.filter(p => p.category === 'Motherboard'));
        setStorage(products.filter(p => p.category === 'SSD'));
        setCases(products.filter(p => p.category === 'Torre'));
        setPsus(products.filter(p => p.category === 'Fonte'));
        setCooling(products.filter(p => p.category === 'Refrigeração'));
      }
    } catch (error) {
      console.error('Erro ao carregar componentes:', error);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedCPU) total += selectedCPU.price;
    if (selectedGPU) total += selectedGPU.price;
    if (selectedRAM && includeRAM) total += selectedRAM.price;
    if (selectedMotherboard) total += selectedMotherboard.price;
    if (selectedStorage) total += selectedStorage.price;
    if (selectedCase) total += selectedCase.price;
    if (selectedPSU) total += selectedPSU.price;
    if (selectedCooling) total += selectedCooling.price;
    
    // Taxa de montagem
    const assemblyFee = 50;
    return total + assemblyFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const requestData = {
        user_id: user?.id || null,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        cpu: selectedCPU?.name || null,
        gpu: selectedGPU?.name || null,
        ram: selectedRAM?.name || null,
        ram_included: includeRAM,
        motherboard: selectedMotherboard?.name || null,
        storage: selectedStorage?.name || null,
        case_type: selectedCase?.name || null,
        power_supply: selectedPSU?.name || null,
        cooling: selectedCooling?.name || null,
        additional_notes: customerInfo.notes,
        estimated_price: calculateTotal(),
        status: 'pending'
      };

      const { error } = await supabase
        .from('custom_pc_requests')
        .insert([requestData]);

      if (error) throw error;

      setSubmitMessage('✅ Pedido enviado com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário após 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao enviar pedido:', error);
      setSubmitMessage('❌ Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const ComponentSelector = ({ 
    title, 
    components, 
    selected, 
    onSelect, 
    icon 
  }: { 
    title: string; 
    components: Component[]; 
    selected: Component | null; 
    onSelect: (component: Component) => void;
    icon: string;
  }) => (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <i className={`${icon} text-2xl text-gold`}></i>
        <h3 className="text-xl font-bold text-black">{title}</h3>
      </div>
      
      {components.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum componente disponível</p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {components.map((component) => (
            <button
              key={component.id}
              onClick={() => onSelect(component)}
              className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                selected?.id === component.id
                  ? 'border-gold bg-gold/10'
                  : 'border-gray-300 hover:border-gold'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-black text-sm">{component.name}</p>
                  <p className="text-gold font-bold text-lg">€{component.price.toFixed(2)}</p>
                </div>
                {selected?.id === component.id && (
                  <i className="ri-checkbox-circle-fill text-2xl text-gold"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://readdy.ai/api/search-image?query=custom%20PC%20building%20components%20laid%20out%20on%20workbench%20with%20tools%20professional%20assembly%20setup%20dark%20background%20with%20golden%20lighting%20technology%20workshop%20professional%20photography&width=1920&height=600&seq=pcbuildhero1&orientation=landscape"
              alt="Montar PC"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
          </div>

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                MONTE SEU <span className="text-gold">PC PERSONALIZADO</span>
              </h1>
              <p className="text-white text-lg mb-6">
                Escolha cada componente e nós montamos para você. Opção de comprar sem RAM para economizar.
              </p>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-2">
                  <i className="ri-tools-line text-gold text-xl"></i>
                  <span>Montagem Profissional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-shield-check-line text-gold text-xl"></i>
                  <span>Garantia Incluída</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Seleção de Componentes */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold text-black mb-6">
                  ESCOLHA OS COMPONENTES
                </h2>

                <ComponentSelector
                  title="PROCESSADOR (CPU)"
                  components={cpus}
                  selected={selectedCPU}
                  onSelect={setSelectedCPU}
                  icon="ri-cpu-line"
                />

                <ComponentSelector
                  title="PLACA DE VÍDEO (GPU)"
                  components={gpus}
                  selected={selectedGPU}
                  onSelect={setSelectedGPU}
                  icon="ri-device-line"
                />

                {/* RAM com opção de incluir ou não */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <i className="ri-database-2-line text-2xl text-gold"></i>
                      <h3 className="text-xl font-bold text-black">MEMÓRIA RAM</h3>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeRAM}
                        onChange={(e) => setIncludeRAM(e.target.checked)}
                        className="w-5 h-5 text-gold cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-black">Incluir RAM</span>
                    </label>
                  </div>

                  {!includeRAM ? (
                    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
                      <p className="text-yellow-800 font-semibold">
                        ⚠️ RAM não incluída - Você pode comprar em outro lugar ou usar RAM que já possui
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {rams.map((component) => (
                        <button
                          key={component.id}
                          type="button"
                          onClick={() => setSelectedRAM(component)}
                          className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                            selectedRAM?.id === component.id
                              ? 'border-gold bg-gold/10'
                              : 'border-gray-300 hover:border-gold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-black text-sm">{component.name}</p>
                              <p className="text-gold font-bold text-lg">€{component.price.toFixed(2)}</p>
                            </div>
                            {selectedRAM?.id === component.id && (
                              <i className="ri-checkbox-circle-fill text-2xl text-gold"></i>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <ComponentSelector
                  title="PLACA-MÃE (MOTHERBOARD)"
                  components={motherboards}
                  selected={selectedMotherboard}
                  onSelect={setSelectedMotherboard}
                  icon="ri-circuit-line"
                />

                <ComponentSelector
                  title="ARMAZENAMENTO (SSD)"
                  components={storage}
                  selected={selectedStorage}
                  onSelect={setSelectedStorage}
                  icon="ri-hard-drive-2-line"
                />

                <ComponentSelector
                  title="GABINETE (TORRE)"
                  components={cases}
                  selected={selectedCase}
                  onSelect={setSelectedCase}
                  icon="ri-computer-line"
                />

                <ComponentSelector
                  title="FONTE DE ALIMENTAÇÃO"
                  components={psus}
                  selected={selectedPSU}
                  onSelect={setSelectedPSU}
                  icon="ri-flashlight-line"
                />

                <ComponentSelector
                  title="REFRIGERAÇÃO"
                  components={cooling}
                  selected={selectedCooling}
                  onSelect={setSelectedCooling}
                  icon="ri-temp-cold-line"
                />

                {/* Informações do Cliente */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-black mb-4">SUAS INFORMAÇÕES</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        NOME COMPLETO *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        E-MAIL *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        TELEFONE
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                        placeholder="+352 XXX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        OBSERVAÇÕES ADICIONAIS
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold resize-none"
                        placeholder="Alguma preferência ou requisito especial?"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        {customerInfo.notes.length}/500 caracteres
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumo e Pré-visualização */}
              <div className="lg:col-span-1">
                <div className="bg-black rounded-lg p-6 sticky top-24">
                  <h3 className="text-2xl font-bold text-gold mb-6">RESUMO DO PEDIDO</h3>

                  <div className="space-y-4 mb-6">
                    {selectedCPU && (
                      <div className="flex justify-between text-white text-sm">
                        <span>CPU</span>
                        <span className="font-bold">€{selectedCPU.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedGPU && (
                      <div className="flex justify-between text-white text-sm">
                        <span>GPU</span>
                        <span className="font-bold">€{selectedGPU.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedRAM && includeRAM && (
                      <div className="flex justify-between text-white text-sm">
                        <span>RAM</span>
                        <span className="font-bold">€{selectedRAM.price.toFixed(2)}</span>
                      </div>
                    )}
                    {!includeRAM && (
                      <div className="flex justify-between text-yellow-400 text-sm">
                        <span>RAM</span>
                        <span className="font-bold">NÃO INCLUÍDA</span>
                      </div>
                    )}
                    {selectedMotherboard && (
                      <div className="flex justify-between text-white text-sm">
                        <span>Placa-Mãe</span>
                        <span className="font-bold">€{selectedMotherboard.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedStorage && (
                      <div className="flex justify-between text-white text-sm">
                        <span>SSD</span>
                        <span className="font-bold">€{selectedStorage.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedCase && (
                      <div className="flex justify-between text-white text-sm">
                        <span>Gabinete</span>
                        <span className="font-bold">€{selectedCase.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedPSU && (
                      <div className="flex justify-between text-white text-sm">
                        <span>Fonte</span>
                        <span className="font-bold">€{selectedPSU.price.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedCooling && (
                      <div className="flex justify-between text-white text-sm">
                        <span>Refrigeração</span>
                        <span className="font-bold">€{selectedCooling.price.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-gold/30 pt-4">
                      <div className="flex justify-between text-gold text-sm mb-2">
                        <span>Taxa de Montagem</span>
                        <span className="font-bold">€50.00</span>
                      </div>
                      <div className="flex justify-between text-gold text-xl font-bold">
                        <span>TOTAL</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {submitMessage && (
                    <div className={`mb-4 p-4 rounded-lg text-sm ${
                      submitMessage.includes('✅') 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {submitMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !selectedCPU || !customerInfo.name || !customerInfo.email}
                    className="w-full px-6 py-4 bg-gold text-black font-bold rounded-lg hover:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>ENVIANDO...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-fill"></i>
                        <span>SOLICITAR ORÇAMENTO</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6 space-y-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-2">
                      <i className="ri-tools-line text-gold"></i>
                      <span>Montagem profissional incluída</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-test-tube-line text-gold"></i>
                      <span>Testado antes do envio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-shield-check-line text-gold"></i>
                      <span>Garantia de 2 anos</span>
                    </div>
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
