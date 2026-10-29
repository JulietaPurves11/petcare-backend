import { Router } from 'express';
import authRoutes from './auth.routes';
import petRoutes from './pet.routes';
import serviceRoutes from './service.routes';
import appointmentRoutes from './appointment.routes';
import medicalRecordRoutes from './medical-record.routes';

const router = Router();

// Ruta de estado
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor PetCare API corriendo correctamente 🐾',
    timestamp: new Date(),
  });
});

// Rutas declaradas
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
export default router;