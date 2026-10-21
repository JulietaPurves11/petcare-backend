import { Router } from 'express';
import { PetController } from '../controllers/pet.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de mascotas requieren autenticación
router.use(authenticateToken);

router.post('/', PetController.create);
router.get('/', PetController.getAll);
router.get('/:id', PetController.getById);
router.put('/:id', PetController.update);
router.delete('/:id', PetController.delete);

export default router;