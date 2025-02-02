import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout'; // Novo componente de layout
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Membros from './pages/Membros';
import Frequencia from './pages/Frequencia';
import MarcarPresenca from './pages/MarcarPresenca';
import { useAuth } from './context/AuthContext'; // Hook de autenticação
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditarCadastro from './pages/EditarCadastro';


// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redireciona para o login se não estiver autenticado
  }

  return children;
};

function App() {
  return (

    <>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="editar/:id" element={<EditarCadastro />} />
          <Route path="membros" element={<Membros />} />
          <Route path="frequencia" element={<Frequencia />} />
          <Route path="marcar-presenca" element={<MarcarPresenca />} />
        </Route>

        {/* Rota de fallback para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;