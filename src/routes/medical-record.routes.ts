import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medical-record.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Todas las rutas requieren token JWT
router.use(authenticateToken);

// Registrar entrada en historia clínica (Solo Vet o Admin)
router.post('/', requireRole([Role.ADMIN, Role.VET]), MedicalRecordController.create);

// Ver historia clínica de una mascota (Cliente dueño o personal)
router.get('/pet/:petId', MedicalRecordController.getByPet);

// Eliminar registro (Solo Admin)
router.delete('/:id', requireRole([Role.ADMIN]), MedicalRecordController.delete);

export default router;