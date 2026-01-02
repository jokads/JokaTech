import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Auto-scroll para o topo quando a rota mudar
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    // Escutar mudanças de rota
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
