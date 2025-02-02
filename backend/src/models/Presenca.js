import mongoose from 'mongoose';

const presencaSchema = new mongoose.Schema({
    idMembro: {
        type: String,
        required: true,
    },
    nomeMembro: {
        type: String,
        required: true,
    },
    presencas: [{
        data: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'A data de presença não pode ser no futuro.',
            },
        },
        presente: {
            type: Boolean,
            required: true,
        },
    }],
});

export default mongoose.model('Presenca', presencaSchema);