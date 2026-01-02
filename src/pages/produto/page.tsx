
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { supabase, Product } from '../../lib/supabase';

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const addToFavorites = () => {
    if (!product) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (!favorites.find((item: any) => item.id === product.id)) {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Produto adicionado aos favoritos!');
    } else {
      alert('Produto já está nos favoritos!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <h1 className="text-3xl font-bold text-black mb-4">Produto não encontrado</h1>
          <Link to="/produtos" className="text-gold hover:underline cursor-pointer">
            Voltar para produtos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [product.image_url, product.image_url, product.image_url];
  const estimatedDelivery = '3-5 dias úteis';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {showAddedMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gold text-black px-6 py-4 rounded-lg shadow-lg font-semibold animate-bounce">
          ✓ Produto adicionado ao carrinho!
        </div>
      )}

      <div className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gold cursor-pointer">Início</Link>
            <span>/</span>
            <Link to="/produtos" className="hover:text-gold cursor-pointer">Produtos</Link>
            <span>/</span>
            <span className="text-black font-semibold">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="w-full h-96 bg-gray-50 rounded-lg mb-4 overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-full h-24 bg-gray-50 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                      selectedImage === idx ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`ri-star-${i < Math.floor(product.rating) ? 'fill' : 'line'} text-gold text-xl`}
                    ></i>
                  ))}
                </div>
                <span className="text-gray-600">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviews_count} avaliações)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-5xl font-bold text-black mb-2">€{product.price.toFixed(2)}</p>
                <p className="text-gray-600">IVA incluído</p>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 10 ? (
                  <p className="text-green-600 font-semibold">✓ Em estoque</p>
                ) : product.stock > 0 ? (
                  <p className="text-orange-600 font-semibold">⚠ Apenas {product.stock} unidades restantes</p>
                ) : (
                  <p className="text-red-600 font-semibold">✗ Esgotado</p>
                )}
              </div>

              {/* Delivery */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <i className="ri-truck-line text-2xl text-gold"></i>
                  <div>
                    <p className="font-semibold text-black">Entrega estimada: {estimatedDelivery}</p>
                    <p className="text-sm text-gray-600">Entregamos em toda a Europa</p>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">QUANTIDADE</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className="text-xl font-bold text-black w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="flex-1 px-8 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  ADICIONAR AO CARRINHO
                </button>
                <button
                  onClick={addToFavorites}
                  className="w-14 h-14 flex items-center justify-center bg-black text-gold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <i className="ri-heart-line text-2xl"></i>
                </button>
              </div>

              {/* Payment Methods */}
              <div className="border-t pt-6">
                <p className="text-sm font-semibold text-black mb-3">MÉTODOS DE PAGAMENTO</p>
                <div className="flex items-center space-x-4">
                  <i className="ri-visa-line text-4xl text-gray-700"></i>
                  <i className="ri-mastercard-line text-4xl text-gray-700"></i>
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-xs font-bold text-gray-700">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-16">
            <div className="border-b mb-8">
              <div className="flex space-x-8">
                <button className="px-1 py-4 border-b-2 border-gold text-black font-semibold">
                  DESCRIÇÃO
                </button>
                <button className="px-1 py-4 border-b-2 border-transparent text-gray-600 hover:text-black">
                  ESPECIFICAÇÕES
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-black mb-8">AVALIAÇÕES DOS CLIENTES</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-black">{review.user_name}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`ri-star-${i < review.rating ? 'fill' : 'line'} text-gold text-sm`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
