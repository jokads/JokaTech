import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase, Product } from '../../lib/supabase';

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Categorias padronizadas com nomes corretos
  const categories = [
    'Todos',
    'GPU',
    'CPU',
    'RAM',
    'SSD',
    'Placa-Mãe',
    'Fonte',
    'Cabos',
    'Torre',
    'Refrigeração',
    'Monitor',
    'Fones de Ouvido',
    'Microfone',
    'Tapete de Mouse',
    'Suporte',
    'Adaptador',
    'Periféricos',
    'PC Completo'
  ];

  const brands = [
    'Todas',
    'NVIDIA',
    'AMD',
    'Intel',
    'Corsair',
    'Samsung',
    'ASUS',
    'MSI',
    'Logitech',
    'G.Skill',
    'Western Digital',
    'Crucial',
    'Kingston',
    'Seagate',
    'Gigabyte',
    'ASRock',
    'be quiet!',
    'Seasonic',
    'CableMod',
    'LG',
    'NZXT',
    'Cooler Master',
    'Thermaltake',
    'HyperX',
    'SteelSeries',
    'Razer',
    'Sony',
    'Shure',
    'Blue',
    'Elgato',
    'Rode',
    'Audio-Technica',
    'Anker',
    'StarTech',
    'CalDigit'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, selectedBrand, priceRange, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Produtos carregados:', data);
      console.log('Categorias únicas:', [...new Set(data?.map(p => p.category))]);
      
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtro de categoria - normalizar nomes
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((p) => {
        const productCategory = p.category.toLowerCase().trim();
        const selectedCat = selectedCategory.toLowerCase().trim();
        
        // Mapeamento de categorias alternativas
        const categoryMap: Record<string, string[]> = {
          'placa-mãe': ['motherboard', 'placa-mãe', 'placa mãe', 'placa mae', 'placa-mae'],
          'fonte': ['fonte', 'fonte de alimentação', 'fonte de alimentacao', 'power supply', 'psu'],
          'cabos': ['cabos', 'cabo', 'acessórios', 'acessorios', 'cables'],
          'ssd': ['armazenamento', 'ssd', 'hdd', 'storage', 'nvme'],
          'refrigeração': ['refrigeração', 'refrigeracao', 'cooler', 'cooling', 'water cooling'],
          'torre': ['torre', 'gabinete', 'case', 'chassis'],
          'fones de ouvido': ['fones de ouvido', 'fone', 'fones', 'headset', 'headphone', 'headphones'],
          'microfone': ['microfone', 'mic', 'microphone', 'microfones'],
          'tapete de mouse': ['tapete de mouse', 'tapete', 'mousepad', 'mouse pad', 'mousemat'],
          'suporte': ['suporte', 'stand', 'holder', 'suportes'],
          'adaptador': ['adaptador', 'adapter', 'hub', 'dock', 'adaptadores']
        };

        // Verificar correspondência direta
        if (productCategory === selectedCat) return true;

        // Verificar mapeamento
        for (const [key, aliases] of Object.entries(categoryMap)) {
          if (selectedCat === key && aliases.some(alias => productCategory.includes(alias) || alias.includes(productCategory))) {
            return true;
          }
        }

        return false;
      });
    }

    // Filtro de marca
    if (selectedBrand !== 'Todas') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Filtro de preço
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Busca
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    console.log('Produtos filtrados:', filtered.length, 'Categoria:', selectedCategory);
    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedBrand('Todas');
    setPriceRange([0, 5000]);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Contar produtos por categoria
  const getCategoryCount = (category: string) => {
    if (category === 'Todos') return products.length;
    
    return products.filter((p) => {
      const productCategory = p.category.toLowerCase().trim();
      const selectedCat = category.toLowerCase().trim();
      
      const categoryMap: Record<string, string[]> = {
        'placa-mãe': ['motherboard', 'placa-mãe', 'placa mãe', 'placa mae', 'placa-mae'],
        'fonte': ['fonte', 'fonte de alimentação', 'fonte de alimentacao', 'power supply', 'psu'],
        'cabos': ['cabos', 'cabo', 'acessórios', 'acessorios', 'cables'],
        'ssd': ['armazenamento', 'ssd', 'hdd', 'storage', 'nvme'],
        'refrigeração': ['refrigeração', 'refrigeracao', 'cooler', 'cooling', 'water cooling'],
        'torre': ['torre', 'gabinete', 'case', 'chassis'],
        'fones de ouvido': ['fones de ouvido', 'fone', 'fones', 'headset', 'headphone', 'headphones'],
        'microfone': ['microfone', 'mic', 'microphone', 'microfones'],
        'tapete de mouse': ['tapete de mouse', 'tapete', 'mousepad', 'mouse pad', 'mousemat'],
        'suporte': ['suporte', 'stand', 'holder', 'suportes'],
        'adaptador': ['adaptador', 'adapter', 'hub', 'dock', 'adaptadores']
      };

      if (productCategory === selectedCat) return true;

      for (const [key, aliases] of Object.entries(categoryMap)) {
        if (selectedCat === key && aliases.some(alias => productCategory.includes(alias) || alias.includes(productCategory))) {
          return true;
        }
      }

      return false;
    }).length;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="bg-black py-16 animate-fade-in">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">TODOS OS PRODUTOS</h1>
            <p className="text-gray-400 text-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
              {products.length} produtos disponíveis • Mostrando {filteredProducts.length} produtos
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    BUSCAR
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar produtos..."
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                    />
                    <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    CATEGORIA
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((cat) => {
                      const count = getCategoryCount(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm flex items-center justify-between ${
                            selectedCategory === cat
                              ? 'bg-gold text-black font-semibold'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`text-xs ${selectedCategory === cat ? 'text-black' : 'text-gray-500'}`}>
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    MARCA
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    FAIXA DE PREÇO
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>€{priceRange[0]}</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliação</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 mt-4">Carregando produtos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-600 text-lg mb-2">Nenhum produto encontrado</p>
                  <p className="text-gray-500 text-sm mb-4">
                    Tente ajustar os filtros ou fazer uma nova busca
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/produto/${product.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gold/20 transition-all">
                        <div className="relative w-full h-64 bg-white">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                          {product.featured && (
                            <div className="absolute top-2 right-2 px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
                              DESTAQUE
                            </div>
                          )}
                          {product.stock < 5 && product.stock > 0 && (
                            <div className="absolute top-2 left-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              ÚLTIMAS UNIDADES
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-bold">ESGOTADO</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                          <h3 className="text-black font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`ri-star-${
                                    i < Math.floor(product.rating) ? 'fill' : 'line'
                                  } text-gold text-sm`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviews_count})
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-black">
                            €{product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
