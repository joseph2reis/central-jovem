import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../service/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Esquema de validação com Yup
const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório').min(5),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    telefone: yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido').required(),
    dataNascimento: yup.string().required('Data de nascimento é obrigatória'),
    projeto: yup.string().required('Projeto é obrigatório'),
    batizado: yup.boolean(),
    dataBatismo: yup.string(),
    tipoMembro: yup.string().required('Tipo de membro é obrigatório'),
    endereco: yup.object().shape({
        cep: yup.string().required('CEP é obrigatório'),
        rua: yup.string().required('Rua é obrigatória'),
        numero: yup.string().required('Número é obrigatório'),
        bairro: yup.string().required('Bairro é obrigatório'),
        cidade: yup.string().required('Cidade é obrigatória'),
        estado: yup.string().required('Estado é obrigatório'),
        complemento: yup.string(),
    }),
});

function EditarCadastro() {
    const { id } = useParams();
    const queryClient = useQueryClient();

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


    const isBatizado = watch('batizado');
    const [cepLoading, setCepLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch de dados com React Query
    const { data: membro, isLoading } = useQuery({
        queryKey: ['membro', id], // Chave da query
        queryFn: async () => {
            const response = await api.get(`/membros/${id}`);
            return response.data;
        },
        enabled: !!id, // Executa apenas se o ID existir
        onError: () => {
            toast.error('Erro ao carregar os dados do membro.');
        },
    });

    useEffect(() => {
        if (membro) {
            reset({
                ...membro,
                dataNascimento: membro.dataNascimento ? membro.dataNascimento.split('T')[0] : '',
                dataBatismo: membro.dataBatismo ? membro.dataBatismo.split('T')[0] : '',
            });
        }
    }, [membro, reset]); // Executa sempre que `membro` for atualizado


    // Mutação para atualização
    const mutation = useMutation({
        mutationFn: (data) => api.put(`/membros/${id}`, data),
        onSuccess: () => {
            toast.success('Cadastro atualizado com sucesso!');
            queryClient.invalidateQueries(['membro', id]);
        },
        onError: (error) => {
            if (error.response?.status === 400 && error.response?.data?.message === 'Email já está em uso') {
                toast.error('Email já está em uso. Escolha outro.');
            } else {
                toast.error('Erro ao atualizar o cadastro.');
            }
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
        navigate('/dashboard/membros');
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Editar Cadastro</h2>

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
                            onClick={() => navigate('/dashboard/membros')}
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

export default EditarCadastro;