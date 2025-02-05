import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheck, FaTimes, FaFilter, FaSearch } from 'react-icons/fa';
import api from '../service/api'; // Importe o serviço de API
import Loading from '../components/Loading';
import Error from '../components/ErrorCarregamento';
import { useQuery } from '@tanstack/react-query';


function Frequencia() {
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    projeto: '',
    semana: ''
  });


  // Função para capitalizar nomes
  function capitalizarNomes(nome) {
    return nome
      .split(' ') // Divide o nome em palavras
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()) // Capitaliza apenas a primeira letra
      .join(' '); // Junta tudo de volta
  }

  // Busca as frequências ao carregar o componente
  const { data: frequencias, isLoading, isError } = useQuery({
    queryKey: ['presencas'],
    queryFn: async () => {
      const response = await api.get('/presencas');
      return response.data.map((presenca) => {
        const presencasPorDia = {};
        presenca.presencas.forEach((p) => {
          const diaSemana = new Date(p.data)
            .toLocaleDateString('pt-BR', { weekday: 'long' })
            .toLowerCase();
          presencasPorDia[diaSemana] = p.presente;
        });

        return {
          id: presenca.idMembro,
          nome: presenca.nomeMembro,
          projeto: 'Projeto do Membro', // Substituir por campo real
          presencas: presencasPorDia
        };
      });
    }
  });


  const diasSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado'
  ];


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPresencaStatus = (presenca) => {
    if (presenca === undefined) return 'pendente';
    return presenca ? 'presente' : 'falta';
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    let totalPresencas = 0;
    let totalDias = 0;

    (frequencias ?? []).forEach(membro => {  // Garante que frequencias nunca seja undefined
      const presencas = Object.values(membro.presencas ?? {}); // Garante que presencas nunca seja undefined
      totalPresencas += presencas.filter(p => p).length;
      totalDias += presencas.length;
    });

    const percentualPresenca = (totalPresencas / (totalDias || 1)) * 100; // Evita divisão por zero
    const percentualFalta = 100 - percentualPresenca;
    const mediaFrequencia = totalPresencas / (frequencias?.length || 1);

    return {
      percentualPresenca: percentualPresenca.toFixed(1),
      percentualFalta: percentualFalta.toFixed(1),
      mediaFrequencia: mediaFrequencia.toFixed(1)
    };
  };


  const estatisticas = calcularEstatisticas();

  // Função para filtrar membros
  const filtrarMembros = () => {
    return frequencias.filter(membro => {
      // Filtro por nome e projeto
      const matchNome = membro.nome.includes(searchTerm.toLowerCase());
      const matchProjeto = !filters.projeto || membro.projeto.toLowerCase() === filters.projeto.toLowerCase();

      // Filtro por semana (implemente a lógica de datas conforme seu modelo)
      let matchSemana = true;
      // Exemplo: if (filters.semana === 'atual') { ... }

      return matchNome && matchProjeto && matchSemana;
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={isError} />;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Controle de Frequência</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Busca por nome */}
              <div className="relative flex-1 sm:flex-initial">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar membro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projeto
                </label>
                <select
                  name="membro"
                  value={filters.projeto}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="obreiro">Obreiros</option>
                  <option value="jovem">Jovens</option>
                  <option value="discipulo">Discípulos</option>

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semana
                </label>
                <select
                  name="semana"
                  value={filters.semana}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="atual">Semana Atual</option>
                  <option value="anterior">Semana Anterior</option>
                  <option value="mes">Este Mês</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Frequência */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>

                {diasSemana.map(dia => (
                  <th key={dia} scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {dia.slice(0, 3)}
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrarMembros().map((membro) => {
                const totalPresencas = Object.values(membro.presencas).filter(Boolean).length;

                return (
                  <tr key={membro.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {capitalizarNomes(membro.nome)}
                    </td>

                    {diasSemana.map(dia => {
                      const status = getPresencaStatus(membro.presencas[dia]);
                      return (
                        <td key={dia} className="px-3 py-4 whitespace-nowrap text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                ${status === 'presente' ? 'bg-green-100 text-green-800' :
                              status === 'falta' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}
                          >
                            {status === 'presente' ? <FaCheck /> :
                              status === 'falta' ? <FaTimes /> : '-'}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {totalPresencas}/{Object.keys(membro.presencas).length}
                    </td>
                  </tr>
                );
              })}
              {filtrarMembros().length === 0 && (
                <tr>
                  <td colSpan={diasSemana.length + 3} className="px-3 py-8 text-center text-gray-500">
                    Nenhum membro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estatísticas de Frequência */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Presenças</p>
              <p className="text-2xl font-bold text-green-600">{estatisticas.percentualPresenca}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheck className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Faltas</p>
              <p className="text-2xl font-bold text-red-600">{estatisticas.percentualFalta}%</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaTimes className="text-xl text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média de Frequência</p>
              <p className="text-2xl font-bold text-blue-600">{estatisticas.mediaFrequencia}</p>
              <p className="text-xs text-gray-500">dias por semana</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCalendarAlt className="text-xl text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Frequencia;