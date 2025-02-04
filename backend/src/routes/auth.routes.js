import express from 'express';
import { registrar, login, atualizarUsuario, deletarUsuario } from '../controllers/authController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas de autenticação
router.post('/registrar', registrar);
router.post('/login', login);
router.put('/atualizar-usuario/:id', autenticar, atualizarUsuario);
router.delete('/deletar-usuario/:id', autenticar, deletarUsuario);

export default router;