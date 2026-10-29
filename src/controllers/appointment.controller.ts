import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentController {
  // Crear turno
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const { petId, serviceId, dateTime, notes } = req.body;

      if (!petId || !serviceId || !dateTime) {
        return res.status(400).json({ error: 'La mascota, el servicio y la fecha son obligatorios.' });
      }

      const newAppointment = await AppointmentService.createAppointment(userId, { petId, serviceId, dateTime, notes });
      return res.status(201).json(newAppointment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Listar mis turnos (Cliente)
  static async getMyAppointments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado.' });

      const appointments = await AppointmentService.getAppointmentsByUser(userId);
      return res.status(200).json(appointments);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Listar todos los turnos (Admin/Vet)
  static async getAll(_req: Request, res: Response) {
    try {
      const appointments = await AppointmentService.getAllAppointments();
      return res.status(200).json(appointments);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Cambiar estado del turno
  static async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status || !Object.values(AppointmentStatus).includes(status)) {
        return res.status(400).json({ error: 'El estado enviado no es válido.' });
      }

      const updatedAppointment = await AppointmentService.updateAppointmentStatus(id, status);
      return res.status(200).json(updatedAppointment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Consultar horarios disponibles
  static async getAvailableSlots(req: Request, res: Response) {
    try {
      const date = req.query.date as string;
      const serviceId = req.query.serviceId as string;

      if (!date || !serviceId) {
        return res.status(400).json({ error: 'La fecha (date) y el serviceId son parámetros requeridos.' });
      }

      const slots = await AppointmentService.getAvailableSlots(date, serviceId);
      return res.status(200).json(slots);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}