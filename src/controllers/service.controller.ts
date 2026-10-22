import { Request, Response } from 'express';
import { ServiceService } from '../services/service.service';

export class ServiceController {
  // Obtener todos los servicios
  static async getAll(_req: Request, res: Response) {
    try {
      const services = await ServiceService.getAllServices();
      return res.status(200).json(services);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Obtener un servicio por ID
  static async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const service = await ServiceService.getServiceById(id);
      return res.status(200).json(service);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Crear servicio
  static async create(req: Request, res: Response) {
    try {
      const { name, description, price, durationMinutes } = req.body;

      if (!name || price === undefined || !durationMinutes) {
        return res.status(400).json({ error: 'El nombre, precio y duración son obligatorios.' });
      }

      const newService = await ServiceService.createService({ name, description, price, durationMinutes });
      return res.status(201).json(newService);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Actualizar servicio
  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedService = await ServiceService.updateService(id, req.body);
      return res.status(200).json(updatedService);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Eliminar servicio
  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await ServiceService.deleteService(id);
      return res.status(200).json({ message: 'Servicio eliminado correctamente.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}