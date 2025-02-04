import React, { useState, useRef } from 'react';
import { FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaDownload } from 'react-icons/fa';
import { FaRegFilePdf } from "react-icons/fa6";
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Membros() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEndereco, setShowEndereco] = useState(null);
  const [modalExclusao, setModalExclusao] = useState({ aberto: false, membroId: null });
  const [fichaMembroId, setFichaMembroId] = useState(null);
  const fichaRef = useRef(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Função para buscar os membros
  const fetchMembros = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await api.get('/membros'); // Faz a requisição ao backend
    if (response.status !== 200) {
      throw new Error('Erro ao buscar membros');
    }
    return response.data;
  };

  // Usa o React Query para buscar os membros
  const { data: membros, isLoading, isError, error } = useQuery({
    queryKey: ['membros'], // Query Key única para esta requisição
    queryFn: fetchMembros, // Função que faz a requisição
    staleTime: 1000 * 60 * 5, // Dados ficam "frescos" por 5 minutos
    select: (data) => data.sort((a, b) => a.nome.localeCompare(b.nome)), // Ordena os membros por nome

  });

  // Função para gerar PDF
  const handleDownloadPDF = () => {
    const element = fichaRef.current;
    const options = {
      margin: 10,
      filename: 'ficha_cadastro.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(options).save();
  };

  // Função para exibir a ficha de um membro
  const handleExibirFicha = (id) => {
    setFichaMembroId(id);
    if (fichaRef.current) {
      fichaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para fechar a ficha
  const handleFecharFicha = () => {
    setFichaMembroId(null);
  };

  // Função para editar um membro
  const handleEditarMembro = (id) => {
    navigate(`/dashboard/editar/${id}`);
  };

  // Função para abrir o modal de exclusão
  const handleAbrirModalExclusao = (id) => {
    setModalExclusao({ aberto: true, membroId: id });
  };

  // Função para fechar o modal de exclusão
  const handleFecharModalExclusao = () => {
    setModalExclusao({ aberto: false, membroId: null });
  };

  // Função para excluir um membro
  const handleExcluirMembro = async () => {
    if (modalExclusao.membroId) {
      try {
        await api.delete(`/membros/${modalExclusao.membroId}`);
        toast.success('Membro excluído com sucesso!');
        // Invalida a query para refazer a requisição e atualizar a lista
        queryClient.invalidateQueries({ queryKey: ['membros'] });
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
        toast.error('Erro ao excluir membro. Tente novamente mais tarde.');
      } finally {
        handleFecharModalExclusao();
      }
    }
  };

  // Função para capitalizar nomes
  function capitalizarNomes(nome) {
    return nome
      .split(' ') // Divide o nome em palavras
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()) // Capitaliza apenas a primeira letra
      .join(' '); // Junta tudo de volta
  }

  // Filtra os membros com base no termo de busca
  const filteredMembros = membros
    ? membros.filter((membro) =>
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  // Exibe um indicador de carregamento
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  // Exibe uma mensagem de erro
  if (isError) {
    return <div className="text-center py-8">Erro: {error.message}</div>;
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
            <tbody>
              {filteredMembros.map((membro) => (
                <React.Fragment key={membro._id}>
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
                      <span className="hidden sm:inline text-sm font-medium text-gray-900">{capitalizarNomes(membro.nome)}</span>
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
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium ">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleEditarMembro(membro._id)}
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 mx-2 transition-colors"
                        onClick={() => handleAbrirModalExclusao(membro._id)}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 transition-colors"
                        onClick={() => handleExibirFicha(membro._id)}
                      >
                        <FaRegFilePdf className="text-lg" />
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal da Ficha */}
      {fichaMembroId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={fichaRef} className="bg-white rounded-lg shadow-md w-full max-w-2xl h-[90vh] overflow-y-auto p-8">
            {/* Cabeçalho com Foto e Dados Pessoais */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-gray-200 pb-6">
              <div className="w-32 h-40 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Foto 3x4</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ficha de Cadastro</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {membros
                    .filter((membro) => membro._id === fichaMembroId)
                    .map((membro) => (
                      <React.Fragment key={membro._id}>
                        <div key="nome">
                          <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                          <p className="mt-1 text-sm text-gray-900 font-semibold">{capitalizarNomes(membro.nome)}</p>
                        </div>
                        <div key="email">
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.email}</p>
                        </div>
                        <div key="telefone">
                          <label className="block text-sm font-medium text-gray-500">Telefone</label>
                          <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.telefone}</p>
                        </div>
                        <div key="dataNascimento">
                          <label className="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                          <p className="mt-1 text-sm text-gray-900 font-semibold">{new Date(membro.dataNascimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Informações Adicionais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {membros
                  .filter((membro) => membro._id === fichaMembroId)
                  .map((membro) => (
                    <React.Fragment key="informacoesAdicionais">
                      <div key="projeto" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Projeto</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.projeto}</p>
                      </div>
                      <div key="tipoMembro" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Tipo de Membro</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.tipoMembro}</p>
                      </div>
                      <div key="batizado" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Batizado</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.batizado ? 'Sim' : 'Não'}</p>
                      </div>
                      {membro.batizado && (
                        <div key="dataBatismo" className="bg-gray-50 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500">Data de Batismo</label>
                          <p className="mt-1 text-sm text-gray-900 font-semibold">{new Date(membro.dataBatismo).toLocaleDateString('pt-br')}</p>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>

            {/* Endereço */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {membros
                  .filter((membro) => membro._id === fichaMembroId)
                  .map((membro) => (
                    <React.Fragment key={membro._id}>
                      <div key="cep" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">CEP</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.cep}</p>
                      </div>
                      <div key="rua" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Rua</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.rua}</p>
                      </div>
                      <div key="numero" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Número</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.numero}</p>
                      </div>
                      <div key="complemento" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Complemento</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.complemento || 'N/A'}</p>
                      </div>
                      <div key="bairro" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Bairro</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.bairro}</p>
                      </div>
                      <div key="cidade" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Cidade</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.cidade}</p>
                      </div>
                      <div key="estado" className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500">Estado</label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">{membro.endereco.estado}</p>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={handleFecharFicha}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fechar Ficha
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaDownload /> Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
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