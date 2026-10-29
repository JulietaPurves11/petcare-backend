import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/medical-record.service';
import { RecordType } from '@prisma/client';

export class MedicalRecordController {
  // Crear registro médico
  static async create(req: Request, res: Response) {
    try {
      const { petId, type, title, appliedDate, dueDate, notes, veterinarian } = req.body;

      if (!petId || !type || !title) {
        return res.status(400).json({ error: 'La mascota (petId), el tipo (type) y el título son obligatorios.' });
      }

      if (!Object.values(RecordType).includes(type)) {
        return res.status(400).json({ error: 'El tipo de registro no es válido (VACCINE, DEWORMING, CONSULTATION, SURGERY).' });
      }

      const newRecord = await MedicalRecordService.createRecord({
        petId,
        type,
        title,
        appliedDate,
        dueDate,
        notes,
        veterinarian,
      });

      return res.status(201).json(newRecord);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Obtener carnet / historial de una mascota
  static async getByPet(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const petId = req.params.petId as string;

      if (!userId || !userRole) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
      }

      const records = await MedicalRecordService.getRecordsByPet(petId, userId, userRole);
      return res.status(200).json(records);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Eliminar un registro médico
  static async delete(req: Request, res: Response) {
    try {
      const recordId = req.params.id as string;
      await MedicalRecordService.deleteRecord(recordId);
      return res.status(200).json({ message: 'Registro médico eliminado correctamente.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}