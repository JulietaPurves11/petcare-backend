import { prisma } from '../config/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { EmailService } from './email.service';

export class AuthService {
  // Registro de usuario
  static async register(data: { email: string; password: string; fullName: string; phone?: string }) {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(data.password);

    // Crear usuario en PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken(newUser.id, newUser.role);

    // Enviar email de bienvenida ANTES del return
    EmailService.sendWelcomeEmail(newUser.email, newUser.fullName);

    return { user: newUser, token };
  }

  // Inicio de sesión
  static async login(data: { email: string; password: string }) {
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciales inválidas.');
    }

    // Comparar contraseña
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.');
    }

    // Generar token
    const token = generateToken(user.id, user.role);

    // Retornar sin la contraseña
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Obtener perfil del usuario por ID
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    return user;
  }
}