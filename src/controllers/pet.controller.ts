import { Request, Response } from 'express';
import { PetService } from '../services/pet.service';

export class PetController {
  // Crear mascota
  static async create(req: Request, res: Response) {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const { name, species, breed, birthDate, weight, photoUrl } = req.body;

      if (!name || !species) {
        return res.status(400).json({ error: 'El nombre y la especie son requeridos.' });
      }

      const newPet = await PetService.createPet(ownerId, { name, species, breed, birthDate, weight, photoUrl });
      return res.status(201).json(newPet);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Listar mis mascotas
  static async getAll(req: Request, res: Response) {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const pets = await PetService.getPetsByOwner(ownerId);
      return res.status(200).json(pets);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Obtener una mascota por ID
  static async getById(req: Request, res: Response) {
    try {
      const ownerId = req.user?.id;
      const id = req.params.id as string;
      if (!ownerId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const pet = await PetService.getPetById(id, ownerId);
      return res.status(200).json(pet);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Actualizar mascota
  static async update(req: Request, res: Response) {
    try {
      const ownerId = req.user?.id;
      const id = req.params.id as string;
      if (!ownerId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const updatedPet = await PetService.updatePet(id, ownerId, req.body);
      return res.status(200).json(updatedPet);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Eliminar mascota
  static async delete(req: Request, res: Response) {
    try {
      const ownerId = req.user?.id;
      const id = req.params.id as string;
      if (!ownerId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      await PetService.deletePet(id, ownerId);
      return res.status(200).json({ message: 'Mascota eliminada correctamente.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}