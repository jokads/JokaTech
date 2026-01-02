import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const Produtos = lazy(() => import('../pages/produtos/page'));
const ProductDetail = lazy(() => import('../pages/produto/page'));
const Carrinho = lazy(() => import('../pages/carrinho/page'));
const Checkout = lazy(() => import('../pages/checkout/page'));
const Sucesso = lazy(() => import('../pages/sucesso/page'));
const Marketplace = lazy(() => import('../pages/marketplace/page'));
const Sobre = lazy(() => import('../pages/sobre/page'));
const Contato = lazy(() => import('../pages/contato/page'));
const Login = lazy(() => import('../pages/login/page'));
const Dashboard = lazy(() => import('../pages/dashboard/page'));
const Privacidade = lazy(() => import('../pages/privacidade/page'));
const Termos = lazy(() => import('../pages/termos/page'));
const MontarPC = lazy(() => import('../pages/montar-pc/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/produtos',
    element: <Produtos />,
  },
  {
    path: '/produto/:id',
    element: <ProductDetail />,
  },
  {
    path: '/carrinho',
    element: <Carrinho />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/sucesso',
    element: <Sucesso />,
  },
  {
    path: '/marketplace',
    element: <Marketplace />,
  },
  {
    path: '/sobre',
    element: <Sobre />,
  },
  {
    path: '/contato',
    element: <Contato />,
  },
  {
    path: '/montar-pc',
    element: <MontarPC />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/privacidade',
    element: <Privacidade />,
  },
  {
    path: '/termos',
    element: <Termos />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
