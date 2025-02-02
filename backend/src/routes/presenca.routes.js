import express from "express";
import { salvarPresencas, buscarPresencasDoDia, buscarTodos } from "../controllers/precencaController.js";
const router = express.Router();

router.get('/', buscarTodos);
router.put('/', salvarPresencas);
router.get('/hoje', buscarPresencasDoDia);

export default router;