import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_default';

// 1. Encriptar contraseña
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 2. Comparar contraseña en texto plano con la encriptada
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// 3. Generar Token JWT
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '7d', // El token dura 7 días
  });
};

// 4. Verificar Token JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};