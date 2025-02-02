import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../service/api'; // Importe a instância do axios
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Membros() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEndereco, setShowEndereco] = useState(null);
  const [membros, setMembros] = useState([]); // Estado para armazenar os membros
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [modalExclusao, setModalExclusao] = useState({ aberto: false, membroId: null }); // Estado para controlar o modal de exclusão
  const navigate = useNavigate();

  const handleEditarMembro = (id) => {
    navigate(`/dashboard/editar/${id}`); // Redireciona para a página de edição
  };

  const handleAbrirModalExclusao = (id) => {
    setModalExclusao({ aberto: true, membroId: id }); // Abre o modal e define o ID do membro a ser excluído
  };

  const handleFecharModalExclusao = () => {
    setModalExclusao({ aberto: false, membroId: null }); // Fecha o modal
  };

  const handleExcluirMembro = async () => {
    if (modalExclusao.membroId) {
      try {
        await api.delete(`/membros/${modalExclusao.membroId}`); // Faz a requisição para excluir
        setMembros(membros.filter((membro) => membro._id !== modalExclusao.membroId)); // Atualiza a lista de membros
        toast.success('Membro excluído com sucesso!'); // Exibe uma mensagem de sucesso
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
        toast.error('Erro ao excluir membro. Tente novamente mais tarde.'); // Exibe uma mensagem de erro
      } finally {
        handleFecharModalExclusao(); // Fecha o modal após a exclusão
      }
    }
  };

  // Busca os membros ao carregar o componente
  useEffect(() => {
    const fetchMembros = async () => {
      try {
        const response = await api.get('/membros'); // Faz a requisição ao backend

        // Verifica se a resposta é um array
        if (Array.isArray(response.data)) {
          setMembros(response.data); // Atualiza o estado com os dados recebidos
        } else {
          console.error('A resposta da API não é um array:', response.data);
          setMembros([]); // Define o estado como array vazio em caso de erro
        }
      } catch (error) {
        console.error('Erro ao buscar membros:', error);
        setMembros([]); // Define o estado como array vazio em caso de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchMembros();
  }, []);

  function capitalizarNomes(nome) {
    return nome.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
  }

  // Filtra os membros com base no termo de busca
  const filteredMembros = membros.filter((membro) =>
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>; // Exibe um indicador de carregamento
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Cabeçalho e campo de busca */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Membros Cadastrados</h2>

          <div className="w-full sm:w-auto relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar membro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabela de membros */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fone
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batizado
                </th>
                <th scope="col" className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frente Jovem
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            {filteredMembros.map((membro) => (
              <tbody key={membro._id} className="bg-white divide-y divide-gray-200">
                <>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col sm:hidden mb-2">
                        <span className="text-sm font-medium text-gray-900">{capitalizarNomes(membro.nome)}</span>
                        <span className="text-sm text-gray-500">{membro.telefone}</span>
                        <div className="flex gap-2 mt-1">
                          {membro.batizado && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Batizado
                            </span>
                          )}
                          {membro.tipoMembro && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {membro.tipoMembro}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-gray-900">{membro.nome}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {membro.telefone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {membro.projeto}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${membro.batizado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {membro.batizado ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${membro.tipoMembro ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {membro.tipoMembro}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setShowEndereco(showEndereco === membro._id ? null : membro._id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <FaMapMarkerAlt className="text-lg" />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-4 transition-colors"
                        onClick={() => handleEditarMembro(membro._id)}
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleAbrirModalExclusao(membro._id)}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                  {showEndereco === membro._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-4 py-4">
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Endereço completo:</p>
                          <p>
                            {membro.endereco.rua}, {membro.endereco.numero} - {membro.endereco.bairro}
                          </p>
                          <p>
                            {membro.endereco.cidade} - {membro.endereco.estado}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {/* Modal de Exclusão */}
      {modalExclusao.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h2>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleFecharModalExclusao}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirMembro}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Membros;