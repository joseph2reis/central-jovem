import express from 'express';
import { autenticar } from '../middlewares/authMiddleware.js';
import {
  cadastrarMembro,
  buscarMembros,
  buscarMembroPorId,
  atualizarMembro,
  marcarPresenca,
  excluirMembro,
} from '../controllers/membroController.js';

const router = express.Router();

// Buscar todos os membros (público ou autenticado, dependendo da regra de negócio)
router.get('/', buscarMembros);

// Buscar um membro por ID (público ou autenticado, dependendo da regra de negócio)
router.get('/:id', buscarMembroPorId);

// Cadastrar um novo membro (protegido por autenticação)
router.post('/', autenticar, cadastrarMembro);

// Atualizar um membro por ID (protegido por autenticação)
router.put('/:id', autenticar, atualizarMembro);

// Marcar presença de um membro (protegido por autenticação)
router.put('/:id/presenca', autenticar, marcarPresenca);

// Excluir um membro por ID (protegido por autenticação)
router.delete('/:id', autenticar, excluirMembro);

export default router;