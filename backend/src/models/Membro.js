import mongoose from 'mongoose';


const enderecoSchema = new mongoose.Schema({
    cep: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\d{5}-\d{3}$/.test(value);
            },
            message: 'O CEP deve estar no formato 99999-999.',
        },
    },
    rua: {
        type: String,
        required: true,
        trim: true,
    },
    numero: {
        type: String,
        required: true,
    },
    bairro: {
        type: String,
        required: true,
        trim: true,
    },
    cidade: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return value.length === 2;
            },
            message: 'O estado deve ser uma sigla de 2 caracteres.',
        },
    },
    complemento: {
        type: String,
        default: '',
        trim: true,
    },
});

const membroSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    telefone: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\(\d{2}\) \d{5}-\d{4}$/.test(value);
            },
            message: 'O telefone deve estar no formato (99) 99999-9999.',
        },
    },
    dataNascimento: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'A data de nascimento não pode ser no futuro.',
        },
    },
    projeto: {
        type: String,
        required: true,
        enum: {
            values: [
                'arcanjo',
                'assistente',
                'atalaia',
                'cultura',
                'esporte',
                'helpe',
                'midia',
                'uniforca',
                'nenhum',
            ],
            message: 'O projeto selecionado não é válido.',
        },
    },
    batizado: {
        type: Boolean,
        default: false,
    },
    dataBatismo: {
        type: Date,
        required: function () {
            return this.batizado;
        },
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'A data de batismo não pode ser no futuro.',
        },
    },

    tipoMembro: {
        type: String,
        required: true,
        enum: ['obreiro', 'jovem', 'discipulo'],
    },

    endereco: enderecoSchema,
});

export default mongoose.model('Membro', membroSchema);