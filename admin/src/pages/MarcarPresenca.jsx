import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../service/api';

function MarcarPresenca() {
  const [filtroJovem, setFiltroJovem] = useState('todos');
  const queryClient = useQueryClient();

  // Função para buscar membros e presenças
  const fetchMembrosEPresencas = async () => {
    const [responseMembros, responsePresencas] = await Promise.all([
      api.get('/membros'),
      api.get('/presencas/hoje'),
    ]);

    const dadosMembros = responseMembros.data;
    const presencasDoDia = responsePresencas.data;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return dadosMembros.map((membro) => {
      const presencaMembro = presencasDoDia.find((p) =>
        p.idMembro === membro._id &&
        p.presencas.some((presenca) => {
          const dataPresenca = new Date(presenca.data);
          dataPresenca.setHours(0, 0, 0, 0);
          return dataPresenca.getTime() === hoje.getTime();
        })
      );

      return {
        ...membro,
        presente: presencaMembro
          ? presencaMembro.presencas.find((p) => {
            const dataPresenca = new Date(p.data);
            dataPresenca.setHours(0, 0, 0, 0);
            return dataPresenca.getTime() === hoje.getTime();
          })?.presente || false
          : false,
      };
    });
  };

  // Usar useQuery para buscar membros e presenças
  const { data: membros, isLoading, isError } = useQuery({
    queryKey: ['membrosEPresencas'], // Chave da query
    queryFn: fetchMembrosEPresencas, // Função de busca
    onError: () => toast.error('Erro ao carregar membros e presenças.'), // Tratamento de erro
  });

  // Função para capitalizar nomes
  function capitalizarNomes(nome) {
    return nome
      .split(' ') // Divide o nome em palavras
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()) // Capitaliza apenas a primeira letra
      .join(' '); // Junta tudo de volta
  }

  // Função para marcar presença localmente
  const marcarPresenca = (id) => {
    const membrosAtualizados = membros.map((membro) =>
      membro._id === id ? { ...membro, presente: !membro.presente } : membro
    );
    queryClient.setQueryData(['membrosEPresencas'], membrosAtualizados);
    toast.success('Presença atualizada com sucesso!');
  };

  // Função para salvar presenças no backend
  const salvarPresencas = async (presencasSalvas) => {
    const response = await api.put('/presencas', presencasSalvas);
    return response.data;
  };

  // Usar useMutation para salvar presenças
  const { mutate: salvarPresencasMutation } = useMutation({
    mutationFn: salvarPresencas, // Função de mutação
    onSuccess: () => {
      toast.success('Presenças salvas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['membrosEPresencas'] }); // Refetch dos dados
    },
    onError: () => toast.error('Erro ao salvar presenças.'),
  });

  // Função para preparar e enviar as presenças
  const handleSalvarPresencas = () => {
    const presencasSalvas = membros.map((membro) => ({
      idMembro: membro._id,
      nomeMembro: membro.nome,
      data: new Date(),
      presente: membro.presente,
    }));
    salvarPresencasMutation(presencasSalvas);
  };

  // Filtrar membros com base no filtro de Frente Jovem
  const membrosFiltrados = membros?.filter((membro) => {
    if (filtroJovem === 'todos') return true;
    if (filtroJovem === 'jovem') return membro.tipoMembro === 'jovem';
    if (filtroJovem === 'obreiro') return membro.tipoMembro === 'obreiro';
    if (filtroJovem === 'discipulo') return membro.tipoMembro === 'discipulo';
    return true;
  }) || [];

  const membrosPresentes = membrosFiltrados.filter((membro) => membro.presente);
  const membrosAusentes = membrosFiltrados.filter((membro) => !membro.presente);

  // Definir o dia atual
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const hoje = new Date();
  const diaAtual = diasSemana[hoje.getDay()];

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar dados.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marcar Presença - {diaAtual}</h1>

      {/* Filtro de Frente Jovem */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por:</label>
        <select
          value={filtroJovem}
          onChange={(e) => setFiltroJovem(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos</option>
          <option value="jovem">Jovem</option>
          <option value="obreiro">Obreiros</option>
          <option value="discipulo">Discípulos</option>
        </select>
      </div>

      {/* Duas colunas: Presentes e Ausentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna de Membros Presentes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Presentes</h2>
          <div className="space-y-2">
            {membrosPresentes.map((membro) => (
              <div
                key={membro._id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <span>{capitalizarNomes(membro.nome)}</span>
                <button
                  onClick={() => marcarPresenca(membro._id)}
                  className="px-4 py-2 rounded flex items-center gap-2 bg-green-100 text-green-800 hover:bg-green-200"
                >
                  <FaCheck className="text-green-600" />
                  Presente
                </button>
              </div>
            ))}
            {membrosPresentes.length === 0 && (
              <p className="text-gray-500 text-center">Nenhum membro marcado como presente.</p>
            )}
          </div>
        </div>

        {/* Coluna de Membros Ausentes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Ausentes</h2>
          <div className="space-y-2">
            {membrosAusentes.map((membro) => (
              <div
                key={membro._id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <span>{capitalizarNomes(membro.nome)}</span>
                <button
                  onClick={() => marcarPresenca(membro._id)}
                  className="px-4 py-2 rounded flex items-center gap-2 bg-red-100 text-red-800 hover:bg-red-200"
                >
                  <FaTimes className="text-red-600" />
                  Falta
                </button>
              </div>
            ))}
            {membrosAusentes.length === 0 && (
              <p className="text-gray-500 text-center">Todos os membros estão presentes.</p>
            )}
          </div>
        </div>
      </div>

      {/* Botão para Salvar Presenças */}
      <div className="mt-6">
        <button
          onClick={handleSalvarPresencas}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Salvar Presenças
        </button>
      </div>
      {/* Toast Container para feedback visual */}
      <ToastContainer />
    </div>
  );
}

export default MarcarPresenca;