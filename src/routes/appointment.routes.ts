import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Todas las rutas de turnos requieren token JWT
router.use(authenticateToken);

// Consulta de horarios disponibles (Cliente y Admin)
router.get('/available-slots', AppointmentController.getAvailableSlots);

// Rutas de cliente
router.post('/', AppointmentController.create);
router.get('/my-appointments', AppointmentController.getMyAppointments);

// Rutas administrativas (Agenda completa y cambio de estado)
router.get('/', requireRole([Role.ADMIN, Role.VET]), AppointmentController.getAll);
router.patch('/:id/status', requireRole([Role.ADMIN, Role.VET]), AppointmentController.updateStatus);

export default router;