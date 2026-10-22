import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Rutas públicas / de consulta (cualquier cliente o visitante autenticado)
router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);

// Rutas protegidas exclusivamente para Administradores o Veterinarios
router.post('/', authenticateToken, requireRole([Role.ADMIN, Role.VET]), ServiceController.create);
router.put('/:id', authenticateToken, requireRole([Role.ADMIN, Role.VET]), ServiceController.update);
router.delete('/:id', authenticateToken, requireRole([Role.ADMIN, Role.VET]), ServiceController.delete);

export default router;