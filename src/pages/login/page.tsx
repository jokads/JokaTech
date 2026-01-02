import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const ADMIN_CREDENTIALS = [
    { email: 'damasclaudio2@gmail.com', password: 'ThugParadise616#' },
    { email: 'marianapesimoes@gmail.com', password: 'MariaSol2004#' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdminLogin = () => {
    const admin = ADMIN_CREDENTIALS.find(
      (cred) => cred.email === formData.email && cred.password === formData.password
    );

    if (admin) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', formData.email);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('storage'));
      
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        if (handleAdminLogin()) {
          return;
        }

        // Login apenas com email e senha - SEM verificação de telefone
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('storage'));

        setMessage('Login realizado com sucesso!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        // Registro apenas com email e senha - SEM telefone
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
            // Desabilitar confirmação de email para facilitar
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        // Login automático após registro
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('storage'));

        setMessage('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error: any) {
      setMessage(error.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      
      localStorage.setItem('userLoggedIn', 'true');
      window.dispatchEvent(new Event('authChange'));
    } catch (error: any) {
      setMessage(error.message || 'Erro ao fazer login social');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-gray-50 rounded-lg p-8">
            <h1 className="text-4xl font-bold text-black text-center mb-8">
              {isLogin ? 'LOGIN' : 'CRIAR CONTA'}
            </h1>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold text-black hover:border-gold transition-colors cursor-pointer flex items-center justify-center space-x-3"
              >
                <i className="ri-google-fill text-xl text-red-500"></i>
                <span>Continuar com Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold text-black hover:border-gold transition-colors cursor-pointer flex items-center justify-center space-x-3"
              >
                <i className="ri-facebook-fill text-xl text-blue-600"></i>
                <span>Continuar com Facebook</span>
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                className="w-full px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center space-x-3"
              >
                <i className="ri-apple-fill text-xl"></i>
                <span>Continuar com Apple</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-600">OU</span>
              </div>
            </div>

            {/* Email/Password Form - SEM TELEFONE */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    NOME COMPLETO
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    placeholder="Seu nome"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  E-MAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  SENHA
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg text-sm ${
                    message.includes('sucesso') || message.includes('criada')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gold text-black font-bold rounded-lg hover:bg-gold-dark transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
                className="text-gold hover:text-black font-semibold cursor-pointer"
              >
                {isLogin ? 'Não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Esqueceu a senha?{' '}
                  <Link to="/contato" className="text-gold hover:text-black font-semibold cursor-pointer">
                    Entre em contato
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}