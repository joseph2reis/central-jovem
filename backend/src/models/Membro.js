import mongoose from 'mongoose';


const enderecoSchema = new mongoose.Schema({
    cep: {
        type: String,
       
    },
    rua: {
        type: String,
        trim: true,
    },
    numero: {
        type: String,
    },
    bairro: {
        type: String,
        trim: true,
    },
    cidade: {
        type: String,
        trim: true,
    },
    estado: {
        type: String,
        trim: true,
       
    },
    complemento: {
        type: String,
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
        unique: true,
        index: true,
    },
    telefone: {
        type: String,
        required: true,
       
    },
    dataNascimento: {
        type: Date,
        
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