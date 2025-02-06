import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../service/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';
import { useMutation, useQueryClient } from '@tanstack/react-query';


// Esquema de validação com Yup
const schema = yup.object().shape({
  nome: yup
    .string()
    .transform((value) => (value ? value.toUpperCase() : value))
    .trim()
    .strict()
    .required('Nome é obrigatório')
    .min(5, 'O nome deve ter pelo menos 5 caracteres')
    .test('tem-sobrenome', 'O nome deve conter um sobrenome', (value) => {
      return value && value.trim().includes(' ');
    }),
  email: yup.string().email('Email inválido'),
  telefone: yup
    .string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido')
    .required('Telefone é obrigatório'),
  dataNascimento: yup.string(),
  projeto: yup.string().required('Projeto é obrigatório'),
  batizado: yup.boolean(),
  dataBatismo: yup.string(),
  tipoMembro: yup
    .string()
    .required('Tipo de membro é obrigatório')
    .oneOf(['obreiro', 'jovem', 'discipulo'], 'Selecione um tipo válido'),
  endereco: yup.object().shape({
    cep: yup.string(),
    rua: yup.string(),
    numero: yup.string(),
    bairro: yup.string(),
    cidade: yup.string(),
    estado: yup.string(),
    complemento: yup.string(),
  }),
});

function Cadastro() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,

  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      projeto: '',
      batizado: false,
      dataBatismo: '',
      tipoMembro: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
      },
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const queryClient = useQueryClient();

  // Observa o valor do checkbox "batizado"
  const isBatizado = watch('batizado');

  // 🚀 Mutação para criar um novo membro
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/membros', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso!');
      queryClient.invalidateQueries(['membros']); // Atualiza a lista de membros
      reset(); // Limpa o formulário após o sucesso
    },
    onError: (error) => {
      if (error.response?.status === 400 && error.response?.data?.message === 'Email já está em uso') {
        toast.error('Email já está em uso. Por favor, use outro.');
      }

      if (error.response?.status === 401) {
        toast.error('Não autorizado, faça login novamente.');
      }

      else {
        toast.error('Erro ao enviar os dados.');
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue('endereco.cep', data.cep);
          setValue('endereco.rua', data.logradouro);
          setValue('endereco.bairro', data.bairro);
          setValue('endereco.cidade', data.localidade);
          setValue('endereco.estado', data.uf);
          toast.success('CEP encontrado com sucesso!');
        } else {
          toast.error('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar CEP. Tente novamente.');
      } finally {
        setCepLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Novo Cadastro</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  autoComplete='off'
                  type="text"
                  {...register('nome')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
                {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      mask="(99) 99999-9999"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...register('dataNascimento')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dataNascimento && <p className="text-sm text-red-500">{errors.dataNascimento.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projeto
                </label>
                <select
                  {...register('projeto')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="arcanjo">Arcanjo</option>
                  <option value="assistente">Assistente</option>
                  <option value="atalaia">Atalaia</option>
                  <option value="cultura">Cultura</option>
                  <option value="esporte">Esporte</option>
                  <option value="helpe">Helpe</option>
                  <option value="midia">Mídia</option>
                  <option value="uniforca">Uniforça</option>
                  <option value="nenhum">Nenhum Projeto</option>
                </select>
                {errors.projeto && <p className="text-sm text-red-500">{errors.projeto.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Membro
                </label>
                <select
                  {...register('tipoMembro')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="obreiro">Obreiro</option>
                  <option value="jovem">Jovem</option>
                  <option value="discipulo">Discípulo</option>
                </select>
                {errors.tipoMembro && <p className="text-sm text-red-500">{errors.tipoMembro.message}</p>}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <Controller
                  name="endereco.cep"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      mask="99999-999"
                      {...field}
                      onBlur={handleCepBlur}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.endereco?.cep && <p className="text-sm text-red-500">{errors.endereco.cep.message}</p>}
                {cepLoading && <p className="text-sm text-gray-500">Buscando CEP...</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua
                </label>
                <input
                  type="text"
                  {...register('endereco.rua')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco?.rua && <p className="text-sm text-red-500">{errors.endereco.rua.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  {...register('endereco.numero')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco?.numero && <p className="text-sm text-red-500">{errors.endereco.numero.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  {...register('endereco.complemento')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  {...register('endereco.bairro')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco?.bairro && <p className="text-sm text-red-500">{errors.endereco.bairro.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  {...register('endereco.cidade')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco?.cidade && <p className="text-sm text-red-500">{errors.endereco.cidade.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  {...register('endereco.estado')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco?.estado && <p className="text-sm text-red-500">{errors.endereco.estado.message}</p>}
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="batizado"
                {...register('batizado')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="batizado" className="text-sm font-medium text-gray-700">
                É batizado nas águas?
              </label>
            </div>

            {/* Campo de Data de Batismo (condicional) */}
            {isBatizado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Batismo
                </label>
                <input
                  type="date"
                  {...register('dataBatismo')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dataBatismo && <p className="text-sm text-red-500">{errors.dataBatismo.message}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLoading ? 'Enviando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Cadastro;