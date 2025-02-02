import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'padrao'],
    default: 'padrao',
  },
});

// Criptografar a senha antes de salvar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senha);
};

export default mongoose.model('Usuario', usuarioSchema);