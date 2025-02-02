import { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../service/api';

function MarcarPresenca() {
  // Estado para armazenar a lista de membros e suas presenças
  const [membros, setMembros] = useState([]);
  const [diaAtual, setDiaAtual] = useState('');
  const [filtroJovem, setFiltroJovem] = useState('todos'); // Estado para o filtro

  console.log(membros);

  useEffect(() => {
    const fetchMembrosEPresencas = async () => {
      try {
        // Busca a lista de membros
        const responseMembros = await api.get('/membros');
        const dadosMembros = responseMembros.data;


        // Busca as presenças do dia atual
        const responsePresencas = await api.get('/presencas/hoje');
        const presencasDoDia = responsePresencas.data;


        // Normaliza a data atual para o início do dia
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Atualiza o estado dos membros com base nas presenças do dia
        const membrosAtualizados = dadosMembros.map((membro) => {
          const presencaMembro = presencasDoDia.find((p) => {
            const dataPresenca = new Date(p.presencas[0].data);
            dataPresenca.setHours(0, 0, 0, 0);
            return p.idMembro === membro._id && dataPresenca.getTime() === hoje.getTime();
          });
          return {
            ...membro,
            presente: presencaMembro ? presencaMembro.presencas[0].presente : false,
          };
        });


        setMembros(membrosAtualizados);
      } catch (error) {

        toast.error('Erro ao carregar membros e presenças.');
      }
    };

    fetchMembrosEPresencas();

    // Definir o dia atual
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const hoje = new Date();
    setDiaAtual(diasSemana[hoje.getDay()]);
  }, []);


  // Função para marcar presença
  const marcarPresenca = (id) => {
    setMembros((prevMembros) =>
      prevMembros.map((membro) =>
        membro._id === id ? { ...membro, presente: !membro.presente } : membro
      )
    );
    toast.success('Presença atualizada com sucesso!');
  };

  // Função para salvar as presenças (pode ser integrada com o backend)
  const salvarPresencas = async () => {
    try {
      // Preparar os dados para enviar ao backend
      const presencasSalvas = membros.map((membro) => ({
        idMembro: membro._id,
        nomeMembro: membro.nome,
        data: new Date(),
        presente: membro.presente,
      }));

      // Enviar os dados para o backend
      const response = await api.put('/presencas', presencasSalvas);

      // Verificar se a requisição foi bem-sucedida
      if (response.status === 200) {
        toast.success('Presenças salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar presenças.');
      }
    } catch (error) {
      console.error('Erro ao salvar presenças:', error);
      toast.error('Erro ao salvar presenças.');
    }
  };

  // Filtrar membros presentes e ausentes com base no filtro de Frente Jovem
  const membrosFiltrados = membros.filter((membro) => {
    if (filtroJovem === 'todos') return true;
    if (filtroJovem === 'jovem') return membro.tipoMembro === 'jovem';
    if (filtroJovem === 'obreiro') return membro.tipoMembro === 'obreiro';
    if (filtroJovem === 'discipulo') return membro.tipoMembro === 'discipulo';
    return true;
  });

  const membrosPresentes = membrosFiltrados.filter((membro) => membro.presente);
  const membrosAusentes = membrosFiltrados.filter((membro) => !membro.presente);

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
                <span>{membro.nome}</span>
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
                <span>{membro.nome}</span>
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
          onClick={salvarPresencas}
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