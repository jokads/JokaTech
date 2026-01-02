import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gold rounded-lg">
                <i className="ri-cpu-line text-2xl text-black"></i>
              </div>
              <span className="text-2xl font-bold text-gold">
                Joka<span className="text-white">Tech</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              PCs e componentes de alta performance. Desempenho real, preço justo.
            </p>
          </div>

          {/* Páginas */}
          <div>
            <h3 className="text-gold font-bold mb-4 text-sm sm:text-base">PÁGINAS</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/montar-pc" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Montar PC
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-gold transition-colors cursor-pointer text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-gold font-bold mb-4 text-sm sm:text-base">CONTATO</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center space-x-2">
                <i className="ri-mail-line text-gold"></i>
                <span className="break-all">jokadas69@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-phone-line text-gold"></i>
                <span>+352 621 717 862</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-whatsapp-line text-gold"></i>
                <span>+352 621 717 862</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-map-pin-line text-gold"></i>
                <span>Luxemburgo</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-gold font-bold mb-4 text-sm sm:text-base">REDES SOCIAIS</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61557849646131"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg transition-all cursor-pointer"
              >
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a
                href="https://www.instagram.com/jokatech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg transition-all cursor-pointer"
              >
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a
                href="https://www.tiktok.com/@jokatech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg transition-all cursor-pointer"
              >
                <i className="ri-tiktok-line text-xl"></i>
              </a>
              <a
                href="https://x.com/jokatech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg transition-all cursor-pointer"
              >
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a
                href="https://www.vinted.fr/member/247792089"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gold/10 hover:bg-gold text-gold hover:text-black rounded-lg transition-all cursor-pointer"
              >
                <i className="ri-shopping-bag-line text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gold/20 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400 text-center sm:text-left">
              <Link to="/privacidade" className="hover:text-gold transition-colors cursor-pointer">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-gold transition-colors cursor-pointer">
                Termos e Condições
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-right">
              © 2025 JokaTech. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
