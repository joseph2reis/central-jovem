import Membro from '../models/Membro.js';

// Cadastrar um novo membro
export const cadastrarMembro = async (req, res) => {
  try {
    const { email } = req.body;

    // Verifica se o email já está em uso
    const membroExistente = await Membro.findOne({ email });

    if (membroExistente) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    const novoMembro = new Membro(req.body);
    await novoMembro.save();
    res.status(201).json({ message: 'Membro cadastrado com sucesso', membro: novoMembro });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao cadastrar membro', error: err.message });
  }
};

// Buscar todos os membros
export const buscarMembros = async (req, res) => {
  try {
    const membros = await Membro.find();
    res.status(200).json(membros);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar membros', error: err.message });
  }
};

// Buscar um membro por ID
export const buscarMembroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const membro = await Membro.findById(id);

    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    res.status(200).json({ message: 'Membro encontrado com sucesso', membro });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar membro', error: err.message });
  }
};

// Atualizar um membro por ID
export const atualizarMembro = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const membro = await Membro.findByIdAndUpdate(id, dadosAtualizados, {
      new: true, // Retorna o documento atualizado
      runValidators: true, // Valida os dados antes de atualizar
    });

    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    res.status(200).json({ message: 'Membro atualizado com sucesso', membro });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar membro', error: err.message });
  }
};

// Marcar presença de um membro
export const marcarPresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const { presente } = req.body;

    const membro = await Membro.findByIdAndUpdate(
      id,
      { presente },
      { new: true }
    );

    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    res.status(200).json({ message: 'Presença marcada com sucesso', membro });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao marcar presença', error: err.message });
  }
};

// Excluir um membro por ID
export const excluirMembro = async (req, res) => {
  try {
    const { id } = req.params;
    const membro = await Membro.findByIdAndDelete(id);

    if (!membro) {
      return res.status(404).json({ message: 'Membro não encontrado' });
    }

    res.status(200).json({ message: 'Membro excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir membro', error: err.message });
  }
};