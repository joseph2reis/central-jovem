import mongoose from 'mongoose';

export function connectToDatabase() {
    // Conectar ao MongoDB
    mongoose.connect(process.env.MONGODB_URI, {
    })
        .then(() => console.log('Conectado ao MongoDB'))
        .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
}
