import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query'; // Importe useQuery
import api from '../service/api';
import {
  FaUsers,
  FaChurch,
  FaPrayingHands,
  FaUserPlus,
  FaFilter,
  FaHandsHelping, // Ícone para Obreiro
  FaUserCheck // Ícone para Discípulo
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loading from '../components/Loading';
import Error from '../components/ErrorCarregamento';

// Componente de Filtro
const FilterSelect = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    projeto: '',
    batizado: '',
    jovem: '',
    obreiro: '',
    discipulo: ''
  });

  // Use useQuery para buscar os dados dos membros
  const { data: membros, isLoading, error } = useQuery({
    queryKey: ['membros'],
    queryFn: async () => {
      const response = await api.get('/membros');
      return response.data;
    }
  });


  const filterMembros = useCallback(() => {
    return membros?.filter((membro) => {
      // Filtro por projeto
      if (filters.projeto && membro.projeto !== filters.projeto) return false;

      // Filtro por batizado
      if (filters.batizado === 'sim' && !membro.batizado) return false;
      if (filters.batizado === 'nao' && membro.batizado) return false;

      // Filtro por tipo de membro (jovem, obreiro, discipulo)
      if (filters.jovem === 'sim' && membro.tipoMembro !== 'jovem') return false;
      if (filters.jovem === 'nao' && membro.tipoMembro === 'jovem') return false;

      if (filters.obreiro === 'sim' && membro.tipoMembro !== 'obreiro') return false;
      if (filters.obreiro === 'nao' && membro.tipoMembro === 'obreiro') return false;

      if (filters.discipulo === 'sim' && membro.tipoMembro !== 'discipulo') return false;
      if (filters.discipulo === 'nao' && membro.tipoMembro === 'discipulo') return false;

      // Se passou por todos os filtros, inclui o membro
      return true;
    });
  }, [membros, filters]);

  const stats = useMemo(() => {
    const membrosFiltrados = filterMembros() || [];

    return {
      totalMembros: membrosFiltrados.length,
      membrosBatizados: membrosFiltrados.filter(membro => membro.batizado).length,
      jovem: membrosFiltrados.filter(membro => membro.tipoMembro === 'jovem').length,
      obreiro: membrosFiltrados.filter(membro => membro.tipoMembro === 'obreiro').length,
      discipulo: membrosFiltrados.filter(membro => membro.tipoMembro === 'discipulo').length,
      novosUltimos30Dias: membrosFiltrados.filter(membro => {
        const dataBatismo = new Date(membro.dataBatismo);
        const dataAtual = new Date();
        const diffTime = Math.abs(dataAtual - dataBatismo);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length
    };
  }, [membros, filters, filterMembros]);

  const dadosGrafico = useMemo(() => {
    const membrosFiltrados = filterMembros() || [];

    // Agrupa os membros por projeto
    const projetos = [
      'arcanjo', 'assistente', 'atalaia', 'cultura', 'esporte', 'helpe', 'midia', 'uniforca', 'nenhum'
    ];

    return projetos.map((projeto) => ({
      projeto,
      quantidade: membrosFiltrados.filter(membro => membro.projeto === projeto).length
    }));
  }, [membros, filters, filterMembros]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Componente de Estatística
  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`text-xl text-${color}-600`} />
        </div>
      </div>
      {label && (
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-gray-100 rounded-full">
              <div
                className={`h-2 bg-${color}-600 rounded-full`}
                style={{ width: `${(value / stats.totalMembros) * 100}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {Math.round((value / stats.totalMembros) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Membros" value={stats.totalMembros} icon={FaUsers} color="blue" />
        <StatCard label="Batizados" value={stats.membrosBatizados} icon={FaChurch} color="green" />
        <StatCard label="Jovem" value={stats.jovem} icon={FaPrayingHands} color="purple" />
        <StatCard label="Obreiro" value={stats.obreiro} icon={FaHandsHelping} color="indigo" />
        <StatCard label="Discípulo" value={stats.discipulo} icon={FaUserCheck} color="yellow" />
        <StatCard label="Novos Membros" value={stats.novosUltimos30Dias} icon={FaUserPlus} color="gray" />
      </div>

      {/* Filtros e Tabela */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Visão Geral dos Membros</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFilter />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FilterSelect
                label="Projeto"
                name="projeto"
                value={filters.projeto}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'arcanjo', label: 'Arcanjo' },
                  { value: 'assistente', label: 'Assistente' },
                  { value: 'atalaia', label: 'Atalaia' },
                  { value: 'cultura', label: 'Cultura' },
                  { value: 'esporte', label: 'Esporte' },
                  { value: 'helpe', label: 'Helpe' },
                  { value: 'midia', label: 'Mídia' },
                  { value: 'uniforca', label: 'Uniforça' }
                ]}
                onChange={handleFilterChange}
              />
              <FilterSelect
                label="Batizado"
                name="batizado"
                value={filters.batizado}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ]}
                onChange={handleFilterChange}
              />
              <FilterSelect
                label="Jovem"
                name="jovem"
                value={filters.jovem}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ]}
                onChange={handleFilterChange}
              />
              <FilterSelect
                label="Obreiro"
                name="obreiro"
                value={filters.obreiro}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ]}
                onChange={handleFilterChange}
              />
              <FilterSelect
                label="Discípulo"
                name="discipulo"
                value={filters.discipulo}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'sim', label: 'Sim' },
                  { value: 'nao', label: 'Não' }
                ]}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Gráfico de Distribuição por Projeto */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Membros por Projeto</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0} >
              <BarChart
                data={dadosGrafico}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="projeto" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade de Membros" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;