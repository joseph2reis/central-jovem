import jwt from 'jsonwebtoken';


export const autenticar = (req, res, next) => {
  
  const token = req.header('Authorization').replace('Bearer ', '');

  console.log('Token recebido:', token); // Depuração

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Payload decodificado:', decoded); // Depuração
    req.usuario = decoded;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err); // Depuração
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export const isAdmin = (req, res, next) => {
  console.log('Usuário autenticado:', req.usuario); // Depuração
  if (!req.usuario || req.usuario.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Permissão de admin necessária.' });
  }
  next();
};


