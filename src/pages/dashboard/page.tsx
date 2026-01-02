import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CustomPCRequests from './components/CustomPCRequests';

type TabType = 'overview' | 'products' | 'orders' | 'customers' | 'marketing' | 'team' | 'notes' | 'notifications' | 'discounts' | 'custom-pc' | 'customer-levels';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  description: string;
  brand: string;
  featured: boolean;
}

interface Order {
  id: string;
  user_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: any;
  items: any[];
  created_at: string;
}

interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: any;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

interface CustomerLevel {
  id: string;
  user_id: string;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
  total_purchases: number;
  total_spent: number;
  positive_reviews: number;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [adminEmail, setAdminEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  
  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    visitors: 1247,
    topCountries: [
      { country: 'Luxemburgo', visitors: 456, flag: '🇱🇺' },
      { country: 'França', visitors: 312, flag: '🇫🇷' },
      { country: 'Bélgica', visitors: 198, flag: '🇧🇪' },
      { country: 'Alemanha', visitors: 156, flag: '🇩🇪' },
      { country: 'Holanda', visitors: 125, flag: '🇳🇱' },
    ]
  });

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState('all');

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Customer Levels
  const [customerLevels, setCustomerLevels] = useState<CustomerLevel[]>([]);
  const [selectedCustomerLevel, setSelectedCustomerLevel] = useState<CustomerLevel | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);

  // Marketing
  const [marketingTemplates] = useState([
    { id: 1, name: 'Promoção Semanal', subject: '🔥 Ofertas Imperdíveis da Semana!', body: 'Confira nossos produtos em promoção esta semana. Descontos de até 30%!' },
    { id: 2, name: 'Novos Produtos', subject: '🆕 Novidades JokaTech', body: 'Acabamos de receber novos produtos incríveis! Seja o primeiro a conferir.' },
    { id: 3, name: 'Carrinho Abandonado', subject: '🛒 Você esqueceu algo no carrinho', body: 'Notamos que você deixou produtos no carrinho. Complete sua compra agora!' },
    { id: 4, name: 'Produtos Favoritos', subject: '⭐ Seus favoritos estão em promoção!', body: 'Os produtos que você favoritou estão com desconto especial!' },
  ]);
  const [selectedCustomersForMarketing, setSelectedCustomersForMarketing] = useState<string[]>([]);
  const [showMarketingPreview, setShowMarketingPreview] = useState(false);
  const [selectedMarketingTemplate, setSelectedMarketingTemplate] = useState<any>(null);

  // Notifications
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedOrderForNotification, setSelectedOrderForNotification] = useState<Order | null>(null);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);

  // Discounts
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState<Product | null>(null);

  // Team
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Claudio Damas', email: 'damasclaudio2@gmail.com', role: 'Super Admin', permissions: ['all'] },
    { id: 2, name: 'Mariana Pereira', email: 'marianapesimoes@gmail.com', role: 'Super Admin', permissions: ['all'] },
  ]);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Notes
  const [notes, setNotes] = useState([
    { id: 1, author: 'Claudio', message: 'Lembrar de atualizar preços na sexta-feira', date: new Date().toISOString() },
  ]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    checkAdminAccess();
    loadAllData();
  }, []);

  const checkAdminAccess = () => {
    const isAdmin = localStorage.getItem('isAdmin');
    const email = localStorage.getItem('adminEmail');

    // Verificar se é um admin autorizado
    const authorizedEmails = ['damasclaudio2@gmail.com', 'marianapesimoes@gmail.com'];
    
    if (!isAdmin || !email || !authorizedEmails.includes(email)) {
      // Limpar dados e redirecionar
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      navigate('/login');
      return;
    }

    setAdminEmail(email);
    setLoading(false);
  };

  const loadAllData = async () => {
    try {
      const [ordersResult, productsResult, levelsResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('*'),
        supabase.from('customer_levels').select('*')
      ]);

      const ordersData = ordersResult.data || [];
      const productsData = productsResult.data || [];
      const levelsData = levelsResult.data || [];

      setOrders(ordersData);
      setProducts(productsData);
      setCustomerLevels(levelsData);

      const totalRevenue = ordersData.reduce((sum, order) => {
        const amount = parseFloat(order.total_amount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      const uniqueEmails = [...new Set(ordersData.map(o => o.user_email))];
      const customersData = uniqueEmails.map((email, idx) => ({
        id: `customer-${idx}`,
        email: email || 'cliente@exemplo.com',
        full_name: `Cliente ${idx + 1}`,
        phone: '+352 621 000 000',
        address: { street: 'Rua Exemplo', city: 'Luxembourg', country: 'Luxembourg', postal: '1234' },
        total_orders: ordersData.filter(o => o.user_email === email).length,
        total_spent: ordersData.filter(o => o.user_email === email).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
        created_at: new Date().toISOString(),
      }));

      setCustomers(customersData);

      setStats({
        ...stats,
        totalOrders: ordersData.length,
        totalRevenue,
        totalProducts: productsData.length,
        totalCustomers: customersData.length,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    navigate('/login');
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([productData]);
      }
      loadAllData();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
        loadAllData();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleSaveCustomer = async (customerData: any) => {
    const newCustomer = {
      id: `customer-${Date.now()}`,
      ...customerData,
      total_orders: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
    setShowCustomerModal(false);
  };

  const handleSendMarketing = (template: any) => {
    setSelectedMarketingTemplate(template);
    setShowMarketingPreview(true);
  };

  const confirmSendMarketing = () => {
    const recipientCount = selectedCustomersForMarketing.length > 0 
      ? selectedCustomersForMarketing.length 
      : customers.length;
    alert(`Email de marketing "${selectedMarketingTemplate.name}" enviado para ${recipientCount} cliente(s)!`);
    setShowMarketingPreview(false);
    setSelectedCustomersForMarketing([]);
  };

  const handleSendNotification = (order: Order) => {
    setSelectedOrderForNotification(order);
    setNotificationMessage(`Olá! Seu pedido #${order.id.slice(0, 8)} foi confirmado e está sendo processado. Valor: €${parseFloat(order.total_amount).toFixed(2)}`);
    setShowNotificationPreview(true);
  };

  const confirmSendNotification = () => {
    alert(`Notificação enviada para ${selectedOrderForNotification?.user_email}!`);
    setShowNotificationPreview(false);
    setNotificationMessage('');
  };

  const handleApplyDiscount = async (productId: string, discountPercent: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newPrice = product.price * (1 - discountPercent / 100);
      await supabase.from('products').update({ price: newPrice }).eq('id', productId);
      loadAllData();
      setShowDiscountModal(false);
      alert(`Desconto de ${discountPercent}% aplicado com sucesso!`);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, {
        id: Date.now(),
        author: adminEmail.split('@')[0],
        message: newNote,
        date: new Date().toISOString()
      }]);
      setNewNote('');
    }
  };

  const toggleCustomerSelection = (customerId: string) => {
    if (selectedCustomersForMarketing.includes(customerId)) {
      setSelectedCustomersForMarketing(selectedCustomersForMarketing.filter(id => id !== customerId));
    } else {
      setSelectedCustomersForMarketing([...selectedCustomersForMarketing, customerId]);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || product.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const calculateDiscount = (level: number): number => {
    if (level < 5) return 0;
    if (level < 10) return 5;
    if (level < 20) return 10;
    if (level < 30) return 15;
    if (level < 40) return 20;
    return 25;
  };

  const getLevelColor = (level: number): string => {
    if (level < 10) return 'from-gray-400 to-gray-600';
    if (level < 20) return 'from-green-400 to-green-600';
    if (level < 30) return 'from-blue-400 to-blue-600';
    if (level < 40) return 'from-purple-400 to-purple-600';
    return 'from-amber-400 to-amber-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm text-white sticky top-0 z-50 shadow-2xl border-b-2 border-amber-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg">
              <i className="ri-cpu-line text-2xl text-black"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-400">JokaTech Admin</h1>
              <p className="text-xs text-gray-400">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer whitespace-nowrap border border-amber-500/30"
            >
              <i className="ri-home-line"></i>
              <span>VOLTAR AO SITE</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
            >
              <i className="ri-logout-box-line"></i>
              <span>SAIR</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Tabs */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg shadow-xl mb-6 p-2 flex flex-wrap gap-2 border border-amber-500/20">
          {[
            { id: 'overview', label: 'Visão Geral', icon: 'ri-dashboard-line' },
            { id: 'products', label: 'Produtos', icon: 'ri-box-line' },
            { id: 'orders', label: 'Pedidos', icon: 'ri-shopping-bag-line' },
            { id: 'custom-pc', label: 'Montar PC', icon: 'ri-computer-line' },
            { id: 'customers', label: 'Clientes', icon: 'ri-user-line' },
            { id: 'customer-levels', label: 'Níveis de Clientes', icon: 'ri-vip-crown-line' },
            { id: 'marketing', label: 'Marketing', icon: 'ri-mail-send-line' },
            { id: 'notifications', label: 'Notificações', icon: 'ri-notification-line' },
            { id: 'discounts', label: 'Descontos', icon: 'ri-percent-line' },
            { id: 'team', label: 'Equipe', icon: 'ri-team-line' },
            { id: 'notes', label: 'Notas', icon: 'ri-sticky-note-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-lg'
                  : 'bg-gray-800/50 text-amber-400 hover:bg-gray-700/50 border border-amber-500/20'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Total de Pedidos</p>
                  <i className="ri-shopping-bag-line text-2xl text-amber-500"></i>
                </div>
                <p className="text-3xl font-bold text-amber-400">{stats.totalOrders}</p>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Receita Total</p>
                  <i className="ri-money-euro-circle-line text-2xl text-green-500"></i>
                </div>
                <p className="text-3xl font-bold text-green-400">€{stats.totalRevenue.toFixed(2)}</p>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Total de Produtos</p>
                  <i className="ri-box-line text-2xl text-blue-500"></i>
                </div>
                <p className="text-3xl font-bold text-blue-400">{stats.totalProducts}</p>
                <p className="text-xs text-gray-400 mt-1">Incluindo PCs e Kits</p>
              </div>

              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Clientes</p>
                  <i className="ri-user-line text-2xl text-purple-500"></i>
                </div>
                <p className="text-3xl font-bold text-purple-400">{stats.totalCustomers}</p>
              </div>
            </div>

            {/* Visitors Stats */}
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20 mb-8">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center space-x-2">
                <i className="ri-global-line"></i>
                <span>VISITANTES DO SITE</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-6 border border-amber-500/30">
                  <p className="text-gray-400 text-sm mb-2">Total de Visitantes</p>
                  <p className="text-5xl font-bold text-amber-400">{stats.visitors}</p>
                  <p className="text-green-400 text-sm mt-2">↑ +12% esta semana</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-4">Top 5 Países</p>
                  <div className="space-y-3">
                    {stats.topCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-amber-500/10">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="text-white font-medium">{country.country}</span>
                        </div>
                        <span className="text-amber-400 font-bold">{country.visitors}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-8 text-center border border-amber-500/30">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">PAINEL ADMINISTRATIVO COMPLETO</h2>
              <p className="text-white mb-6">
                Controle total sobre produtos (incluindo PCs prontos e kits), pedidos, clientes, pedidos de montagem personalizada, marketing e equipe. Tudo em um só lugar.
              </p>
              <div className="flex items-center justify-center space-x-8 text-white">
                <div>
                  <p className="text-2xl font-bold text-amber-400">100%</p>
                  <p className="text-sm">Controle Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">24/7</p>
                  <p className="text-sm">Acesso</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">🔒</p>
                  <p className="text-sm">Seguro</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-6 border border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">GERENCIAR PRODUTOS</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
                >
                  <i className="ri-add-line"></i>
                  <span>ADICIONAR PRODUTO</span>
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"></i>
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-white"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="CPU">CPU</option>
                  <option value="GPU">GPU</option>
                  <option value="RAM">RAM</option>
                  <option value="Armazenamento">Armazenamento</option>
                  <option value="Placa-Mãe">Placa-Mãe</option>
                  <option value="Fonte">Fonte</option>
                  <option value="Cabos">Cabos</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Periféricos">Periféricos</option>
                  <option value="PC Completo">PC Completo</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-amber-500/30">
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">IMAGEM</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">NOME</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">CATEGORIA</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">PREÇO</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">ESTOQUE</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-amber-500/10 hover:bg-gray-800/30">
                        <td className="py-3 px-4">
                          <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                        </td>
                        <td className="py-3 px-4 font-medium text-white">{product.name}</td>
                        <td className="py-3 px-4 text-gray-400">{product.category}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">€{product.price}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {product.stock} un.
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductModal(true);
                              }}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors cursor-pointer border border-blue-500/30"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer border border-red-500/30"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">GERENCIAR PEDIDOS</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-white"
                  >
                    <option value="all">Todos os Pedidos</option>
                    <option value="pending">Pendente</option>
                    <option value="processing">Processando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-amber-500/30">
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">CLIENTE</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">TOTAL</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">STATUS</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">PAGAMENTO</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">DATA</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-amber-400">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-amber-500/10 hover:bg-gray-800/30">
                        <td className="py-3 px-4 font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-white">{order.user_email}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">€{parseFloat(order.total_amount).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleSendNotification(order)}
                            className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer border border-amber-500/30"
                          >
                            <i className="ri-notification-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Custom PC Requests Tab */}
        {activeTab === 'custom-pc' && (
          <CustomPCRequests />
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">GERENCIAR CLIENTES</h2>
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
                >
                  <i className="ri-user-add-line"></i>
                  <span>ADICIONAR CLIENTE</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"></i>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="bg-gray-800/50 rounded-lg p-4 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-amber-400"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-2xl">
                        {customer.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{customer.full_name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Pedidos:</span>
                        <span className="font-bold text-white">{customer.total_orders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Gasto:</span>
                        <span className="font-bold text-amber-400">€{customer.total_spent.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">DETALHES DO CLIENTE</h3>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-1">Nome Completo</p>
                    <p className="font-bold text-white">{selectedCustomer.full_name}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="font-bold text-white">{selectedCustomer.email}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-1">Telefone</p>
                    <p className="font-bold text-white">{selectedCustomer.phone}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-1">Endereço de Entrega</p>
                    <p className="font-bold text-white">
                      {selectedCustomer.address?.street}<br />
                      {selectedCustomer.address?.city}, {selectedCustomer.address?.postal}<br />
                      {selectedCustomer.address?.country}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/30">
                      <p className="text-sm text-gray-400 mb-1">Total de Pedidos</p>
                      <p className="text-2xl font-bold text-amber-400">{selectedCustomer.total_orders}</p>
                    </div>

                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <p className="text-sm text-gray-400 mb-1">Total Gasto</p>
                      <p className="text-2xl font-bold text-green-400">€{selectedCustomer.total_spent.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-1">Cliente desde</p>
                    <p className="font-bold text-white">
                      {new Date(selectedCustomer.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add Customer Modal */}
            {showCustomerModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-md w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">ADICIONAR CLIENTE</h3>
                    <button
                      onClick={() => setShowCustomerModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const customerData = {
                        email: formData.get('email'),
                        full_name: formData.get('full_name'),
                        phone: formData.get('phone'),
                        address: {
                          street: formData.get('street'),
                          city: formData.get('city'),
                          postal: formData.get('postal'),
                          country: formData.get('country'),
                        },
                      };
                      handleSaveCustomer(customerData);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Telefone (Opcional)</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Rua</label>
                      <input
                        type="text"
                        name="street"
                        required
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-amber-400 mb-2">Cidade</label>
                        <input
                          type="text"
                          name="city"
                          required
                          className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-amber-400 mb-2">Código Postal</label>
                        <input
                          type="text"
                          name="postal"
                          required
                          className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">País</label>
                      <input
                        type="text"
                        name="country"
                        required
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      ADICIONAR CLIENTE
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Levels Tab */}
        {activeTab === 'customer-levels' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">NÍVEIS DE CLIENTES</h2>
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-500/20 rounded-lg px-4 py-2 border border-amber-500/30">
                    <p className="text-amber-400 font-bold">{customerLevels.length} Clientes com Nível</p>
                  </div>
                </div>
              </div>

              {/* Level System Info */}
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-6 mb-6 border-2 border-amber-500/30">
                <h3 className="text-lg font-bold text-white mb-4">📊 SISTEMA DE NÍVEIS E DESCONTOS</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">Nível 1-4</p>
                    <p className="text-sm text-gray-300">0% Desconto</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">Nível 5-9</p>
                    <p className="text-sm text-gray-300">5% Desconto</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">Nível 10-19</p>
                    <p className="text-sm text-gray-300">10% Desconto</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">Nível 20-39</p>
                    <p className="text-sm text-gray-300">15-20% Desconto</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">Nível 40-50</p>
                    <p className="text-sm text-gray-300">25% Desconto</p>
                  </div>
                </div>
              </div>

              {customerLevels.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-vip-crown-line text-6xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400 text-lg">Nenhum cliente com nível registrado ainda</p>
                  <p className="text-gray-500 text-sm mt-2">Os níveis são criados automaticamente quando os clientes fazem compras</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerLevels.map((customerLevel) => {
                    const xpProgress = (customerLevel.current_xp / customerLevel.xp_to_next_level) * 100;
                    const discount = calculateDiscount(customerLevel.level);
                    const levelColor = getLevelColor(customerLevel.level);

                    return (
                      <div
                        key={customerLevel.id}
                        onClick={() => {
                          setSelectedCustomerLevel(customerLevel);
                          setShowLevelModal(true);
                        }}
                        className="bg-gray-800/50 rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-amber-400"
                      >
                        {/* Level Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${levelColor} rounded-full flex items-center justify-center shadow-lg`}>
                            <span className="text-2xl font-bold text-white">{customerLevel.level}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Desconto Atual</p>
                            <p className="text-2xl font-bold text-amber-400">{discount}%</p>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-400">ID do Cliente</p>
                          <p className="font-mono text-xs text-white">{customerLevel.user_id.slice(0, 16)}...</p>
                        </div>

                        {/* XP Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Progresso XP</span>
                            <span className="text-xs text-white font-bold">
                              {customerLevel.current_xp} / {customerLevel.xp_to_next_level} XP
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${levelColor} transition-all duration-500 flex items-center justify-center`}
                              style={{ width: `${xpProgress}%` }}
                            >
                              <span className="text-xs font-bold text-white">
                                {xpProgress.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          {customerLevel.level < 50 && (
                            <p className="text-xs text-gray-400 mt-1">
                              Faltam {customerLevel.xp_to_next_level - customerLevel.current_xp} XP para o Nível {customerLevel.level + 1}
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-900/50 rounded-lg p-3 border border-amber-500/10">
                            <p className="text-xs text-gray-400 mb-1">Total de Compras</p>
                            <p className="text-3xl font-bold text-white">{customerLevel.total_purchases}</p>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-3 border border-amber-500/10">
                            <p className="text-xs text-gray-400 mb-1">Total Gasto</p>
                            <p className="text-3xl font-bold text-green-400">€{customerLevel.total_spent.toFixed(2)}</p>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-3 border border-amber-500/10">
                            <p className="text-xs text-gray-400 mb-1">Avaliações Positivas</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-3xl font-bold text-amber-400">{customerLevel.positive_reviews}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className="ri-star-fill text-amber-400 text-xs"></i>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-3 border border-amber-500/10">
                            <p className="text-xs text-gray-400 mb-1">XP Atual</p>
                            <p className="text-3xl font-bold text-blue-400">{customerLevel.current_xp}</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Cliente desde</p>
                              <p className="font-bold text-white">
                                {new Date(customerLevel.created_at).toLocaleDateString('pt-PT')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Última atualização</p>
                              <p className="font-bold text-white">
                                {new Date(customerLevel.updated_at).toLocaleDateString('pt-PT')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Level Detail Modal */}
            {showLevelModal && selectedCustomerLevel && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-500/30">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-amber-400">DETALHES DO NÍVEL</h3>
                      <button
                        onClick={() => setShowLevelModal(false)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                      >
                        <i className="ri-close-line text-2xl"></i>
                      </button>
                    </div>

                    {/* Level Badge Large */}
                    <div className="flex items-center justify-center mb-6">
                      <div className={`w-32 h-32 bg-gradient-to-br ${getLevelColor(selectedCustomerLevel.level)} rounded-full flex items-center justify-center shadow-2xl`}>
                        <div className="text-center">
                          <p className="text-5xl font-bold text-white">{selectedCustomerLevel.level}</p>
                          <p className="text-xs text-white/80">NÍVEL</p>
                        </div>
                      </div>
                    </div>

                    {/* Discount Info */}
                    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-6 mb-6 border-2 border-amber-500/30 text-center">
                      <p className="text-sm text-gray-300 mb-2">Desconto Atual do Cliente</p>
                      <p className="text-5xl font-bold text-amber-400">{calculateDiscount(selectedCustomerLevel.level)}%</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {selectedCustomerLevel.level < 5 && 'Chegue ao nível 5 para desbloquear descontos'}
                        {selectedCustomerLevel.level >= 5 && selectedCustomerLevel.level < 50 && `Próximo desconto no nível ${Math.ceil(selectedCustomerLevel.level / 10) * 10}`}
                        {selectedCustomerLevel.level === 50 && 'DESCONTO MÁXIMO ALCANÇADO!'}
                      </p>
                    </div>

                    {/* XP Progress */}
                    <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-amber-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-white">PROGRESSO DE XP</p>
                        <p className="text-sm text-amber-400 font-bold">
                          {selectedCustomerLevel.current_xp} / {selectedCustomerLevel.xp_to_next_level} XP
                        </p>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden mb-2">
                        <div
                          className={`h-full bg-gradient-to-r ${getLevelColor(selectedCustomerLevel.level)} transition-all duration-500 flex items-center justify-center`}
                          style={{ width: `${(selectedCustomerLevel.current_xp / selectedCustomerLevel.xp_to_next_level) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {((selectedCustomerLevel.current_xp / selectedCustomerLevel.xp_to_next_level) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      {selectedCustomerLevel.level < 50 && (
                        <p className="text-xs text-gray-400 text-center">
                          Faltam {selectedCustomerLevel.xp_to_next_level - selectedCustomerLevel.current_xp} XP para o Nível {selectedCustomerLevel.level + 1}
                        </p>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                        <p className="text-sm text-gray-400 mb-1">Total de Compras</p>
                        <p className="text-3xl font-bold text-white">{selectedCustomerLevel.total_purchases}</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                        <p className="text-sm text-gray-400 mb-1">Total Gasto</p>
                        <p className="text-3xl font-bold text-green-400">€{selectedCustomerLevel.total_spent.toFixed(2)}</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                        <p className="text-sm text-gray-400 mb-1">Avaliações Positivas</p>
                        <p className="text-3xl font-bold text-amber-400">{selectedCustomerLevel.positive_reviews}</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                        <p className="text-sm text-gray-400 mb-1">XP Atual</p>
                        <p className="text-3xl font-bold text-blue-400">{selectedCustomerLevel.current_xp}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Cliente desde</p>
                          <p className="font-bold text-white">
                            {new Date(selectedCustomerLevel.created_at).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Última atualização</p>
                          <p className="font-bold text-white">
                            {new Date(selectedCustomerLevel.updated_at).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marketing Tab */}
        {activeTab === 'marketing' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">MARKETING POR EMAIL</h2>
              
              {/* Customer Selection */}
              <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Selecionar Destinatários</h3>
                  <button
                    onClick={() => {
                      if (selectedCustomersForMarketing.length === customers.length) {
                        setSelectedCustomersForMarketing([]);
                      } else {
                        setSelectedCustomersForMarketing(customers.map(c => c.id));
                      }
                    }}
                    className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors cursor-pointer border border-amber-500/30 whitespace-nowrap"
                  >
                    {selectedCustomersForMarketing.length === customers.length ? 'DESMARCAR TODOS' : 'SELECIONAR TODOS'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {customers.map((customer) => (
                    <label key={customer.id} className="flex items-center space-x-2 cursor-pointer bg-gray-900/50 p-2 rounded border border-amber-500/10 hover:border-amber-500/30">
                      <input
                        type="checkbox"
                        checked={selectedCustomersForMarketing.includes(customer.id)}
                        onChange={() => toggleCustomerSelection(customer.id)}
                        className="w-4 h-4 text-amber-600 cursor-pointer"
                      />
                      <span className="text-sm text-white truncate">{customer.email}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedCustomersForMarketing.length > 0 
                    ? `${selectedCustomersForMarketing.length} cliente(s) selecionado(s)` 
                    : 'Nenhum cliente selecionado (enviará para todos)'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingTemplates.map((template) => (
                  <div key={template.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border-2 border-amber-500/20 hover:border-amber-400 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{template.name}</h3>
                      <i className="ri-mail-line text-2xl text-amber-500"></i>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Assunto:</p>
                        <p className="font-medium text-white">{template.subject}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Mensagem:</p>
                        <p className="text-sm text-gray-300">{template.body}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendMarketing(template)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                    >
                      <i className="ri-send-plane-fill"></i>
                      <span>ENVIAR</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-6 border-2 border-amber-500/30">
                <h3 className="text-lg font-bold text-white mb-4">📊 ESTATÍSTICAS DE MARKETING</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">{customers.length}</p>
                    <p className="text-sm text-gray-300">Total de Clientes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">85%</p>
                    <p className="text-sm text-gray-300">Taxa de Abertura</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">42%</p>
                    <p className="text-sm text-gray-300">Taxa de Cliques</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Preview Modal */}
            {showMarketingPreview && selectedMarketingTemplate && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">PRÉVIA DO EMAIL</h3>
                    <button
                      onClick={() => setShowMarketingPreview(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Assunto:</p>
                      <p className="text-lg font-bold text-black">{selectedMarketingTemplate.subject}</p>
                    </div>
                    <div>
                      <p className="text-gray-800">{selectedMarketingTemplate.body}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">JokaTech - Tecnologia de Qualidade</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/20 rounded-lg p-4 mb-6 border border-amber-500/30">
                    <p className="text-white font-bold">
                      📧 Será enviado para: {selectedCustomersForMarketing.length > 0 
                        ? `${selectedCustomersForMarketing.length} cliente(s) selecionado(s)` 
                        : `${customers.length} cliente(s) (todos)`}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowMarketingPreview(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={confirmSendMarketing}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      CONFIRMAR ENVIO
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">NOTIFICAÇÕES DE PEDIDOS</h2>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</span>
                          <span className="text-white font-medium">{order.user_email}</span>
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Total: <span className="text-amber-400 font-bold">€{parseFloat(order.total_amount).toFixed(2)}</span> • 
                          Data: {new Date(order.created_at).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSendNotification(order)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
                      >
                        <i className="ri-notification-line"></i>
                        <span>NOTIFICAR</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preview Modal */}
            {showNotificationPreview && selectedOrderForNotification && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">PRÉVIA DA NOTIFICAÇÃO</h3>
                    <button
                      onClick={() => setShowNotificationPreview(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-amber-400 mb-2">Mensagem da Notificação</label>
                    <textarea
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-white"
                    />
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <i className="ri-notification-line text-2xl text-black"></i>
                      </div>
                      <div>
                        <p className="font-bold text-black">JokaTech</p>
                        <p className="text-sm text-gray-600">Atualização do Pedido</p>
                      </div>
                    </div>
                    <p className="text-gray-800">{notificationMessage}</p>
                  </div>

                  <div className="bg-amber-500/20 rounded-lg p-4 mb-6 border border-amber-500/30">
                    <p className="text-white font-bold">
                      📧 Será enviado para: {selectedOrderForNotification.user_email}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowNotificationPreview(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={confirmSendNotification}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      CONFIRMAR ENVIO
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">GERENCIAR DESCONTOS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-800/50 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400 transition-all">
                    <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <h3 className="text-white font-bold mb-2">{product.name}</h3>
                    <p className="text-amber-400 font-bold text-xl mb-4">€{product.price}</p>
                    <button
                      onClick={() => {
                        setSelectedProductForDiscount(product);
                        setShowDiscountModal(true);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
                    >
                      <i className="ri-percent-line"></i>
                      <span>APLICAR DESCONTO</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Modal */}
            {showDiscountModal && selectedProductForDiscount && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-md w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">APLICAR DESCONTO</h3>
                    <button
                      onClick={() => setShowDiscountModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <div className="mb-6">
                    <img src={selectedProductForDiscount.image_url} alt={selectedProductForDiscount.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h4 className="text-white font-bold text-lg mb-2">{selectedProductForDiscount.name}</h4>
                    <p className="text-amber-400 font-bold text-2xl">Preço Atual: €{selectedProductForDiscount.price}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[10, 20, 30, 40, 50].map((discount) => {
                      const newPrice = selectedProductForDiscount.price * (1 - discount / 100);
                      return (
                        <button
                          key={discount}
                          onClick={() => handleApplyDiscount(selectedProductForDiscount.id, discount)}
                          className="bg-gray-800/50 border-2 border-amber-500/30 rounded-lg p-4 hover:border-amber-400 transition-all cursor-pointer"
                        >
                          <p className="text-amber-400 font-bold text-2xl mb-1">{discount}%</p>
                          <p className="text-white text-sm">Novo: €{newPrice.toFixed(2)}</p>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => {
                        const customDiscount = prompt('Digite a porcentagem de desconto (0-100):');
                        if (customDiscount) {
                          const discount = parseFloat(customDiscount);
                          if (discount >= 0 && discount <= 100) {
                            handleApplyDiscount(selectedProductForDiscount.id, discount);
                          } else {
                            alert('Desconto inválido! Use um valor entre 0 e 100.');
                          }
                        }
                      }}
                      className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <p className="text-black font-bold text-lg">CUSTOM</p>
                      <p className="text-black text-sm">Personalizado</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">GERENCIAR EQUIPE</h2>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
                >
                  <i className="ri-user-add-line"></i>
                  <span>ADICIONAR MEMBRO</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border-2 border-amber-500/20">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-2xl">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Permissões:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.permissions.includes('all') ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                            ACESSO TOTAL
                          </span>
                        ) : (
                          member.permissions.map((perm, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">
                              {perm}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Team Member Modal */}
            {showTeamModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-md w-full p-6 border-2 border-amber-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-amber-400">ADICIONAR MEMBRO</h3>
                    <button
                      onClick={() => setShowTeamModal(false)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        placeholder="João Silva"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        placeholder="joao@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Senha</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Cargo</label>
                      <select className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-white">
                        <option>Gerente de Produtos</option>
                        <option>Gerente de Marketing</option>
                        <option>Atendimento ao Cliente</option>
                        <option>Administrador</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-amber-400 mb-2">Permissões</label>
                      <div className="space-y-2">
                        {['Produtos', 'Pedidos', 'Clientes', 'Marketing'].map((perm) => (
                          <label key={perm} className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-amber-600 cursor-pointer" />
                            <span className="text-sm text-white">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                    >
                      ADICIONAR MEMBRO
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-amber-500/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">NOTAS DA EQUIPE</h2>

              <div className="mb-6">
                <div className="flex items-start space-x-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escrever nova nota para a equipe..."
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-white"
                    rows={3}
                    maxLength={500}
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
                  >
                    <i className="ri-send-plane-fill"></i>
                    <span>ENVIAR</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{newNote.length}/500 caracteres</p>
              </div>

              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg p-4 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-lg">
                          {note.author.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{note.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(note.date).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <p className="text-white">{note.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-500/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-amber-400">
                  {editingProduct ? 'EDITAR PRODUTO' : 'ADICIONAR PRODUTO'}
                </h3>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer text-white"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const productData = {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price') as string),
                    category: formData.get('category'),
                    brand: formData.get('brand'),
                    stock: parseInt(formData.get('stock') as string),
                    image_url: formData.get('image_url'),
                    featured: formData.get('featured') === 'on',
                    specifications: {},
                    rating: 5,
                    reviews_count: 0,
                  };
                  handleSaveProduct(productData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-amber-400 mb-2">Nome do Produto</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-400 mb-2">Descrição</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-amber-400 mb-2">Preço (€)</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingProduct?.price}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-400 mb-2">Estoque</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={editingProduct?.stock}
                      required
                      className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-amber-400 mb-2">Categoria</label>
                    <select
                      name="category"
                      defaultValue={editingProduct?.category}
                      required
                      className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-white"
                    >
                      <option value="CPU">CPU</option>
                      <option value="GPU">GPU</option>
                      <option value="RAM">RAM</option>
                      <option value="Armazenamento">Armazenamento</option>
                      <option value="Placa-Mãe">Placa-Mãe</option>
                      <option value="Fonte">Fonte</option>
                      <option value="Cabos">Cabos</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Periféricos">Periféricos</option>
                      <option value="PC Completo">PC Completo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-400 mb-2">Marca</label>
                    <input
                      type="text"
                      name="brand"
                      defaultValue={editingProduct?.brand}
                      required
                      className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-amber-400 mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    name="image_url"
                    defaultValue={editingProduct?.image_url}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-amber-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={editingProduct?.featured}
                      className="w-4 h-4 text-amber-600 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-amber-400">Produto em Destaque</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  {editingProduct ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR PRODUTO'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}