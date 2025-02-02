import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import membroRoutes from './src/routes/membro.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import { connectToDatabase } from './src/config/dataBase.js';
import presencaRoutes from './src/routes/presenca.routes.js';

// Carregar variáveis de ambiente
dotenv.config();

// Configurar o servidor
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rotas
app.use('/api/membros', membroRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/presencas', presencaRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('Backend da Frequência está funcionando!');
});

// Adicionar validação de variáveis de ambiente
if (!process.env.PORT || !process.env.MONGODB_URI) {
    throw new Error('Variáveis de ambiente essenciais não configuradas!');
}

// Melhorar ordem de inicialização (conectar DB primeiro)
const startServer = async () => {
    try {
        connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha na inicialização:', error);
        process.exit(1);
    }
};

// Iniciar aplicação
startServer();

// Adicionar tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});