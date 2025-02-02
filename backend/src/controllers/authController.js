import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';

// Registrar um novo usuário
export const registrar = async (req, res) => {
  try {
    const { email, senha, role } = req.body;

    // Verificar se o email já está em uso
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criar novo usuário
    const novoUsuario = new Usuario({ email, senha, role });
    await novoUsuario.save();

    // Gerar token JWT
    const token = jwt.sign({ id: novoUsuario._id, role: novoUsuario.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
};

// Login de usuário
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar a senha
    const passwordValida = await usuario.compararSenha(password);
    if (!passwordValida) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
  }
};