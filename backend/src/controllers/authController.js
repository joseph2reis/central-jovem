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

// Atualizar um usuário
export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID do usuário a ser atualizado
    const { email, senha, role } = req.body; // Campos que podem ser atualizados

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o novo email já está em uso (caso o email seja atualizado)
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ email });
      if (emailExistente) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    // Atualizar os campos fornecidos
    if (email) usuario.email = email;
    if (senha) usuario.senha = senha; // A senha será hasheada automaticamente pelo modelo, se configurado
    if (role) usuario.role = role;

    // Salvar as alterações no banco de dados
    await usuario.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso', usuario });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
  }
};

// Deletar um usuário
export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID do usuário a ser deletado

    // Verificar se o usuário existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Deletar o usuário
    await Usuario.findByIdAndDelete(id);

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error: err.message });
  }
};