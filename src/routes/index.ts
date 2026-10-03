import { Router } from 'express';

const router = Router();

// Ruta de estado del servidor
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor PetCare API corriendo correctamente 🐾',
    timestamp: new Date()
  });
});

export default router;