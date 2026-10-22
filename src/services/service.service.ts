import { prisma } from '../config/db';

export class ServiceService {
  // 1. Obtener catálogo completo de servicios
  static async getAllServices() {
    return prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 2. Obtener un servicio por ID
  static async getServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error('Servicio no encontrado.');
    }

    return service;
  }

  // 3. Crear un nuevo servicio (solo Admin/Vet)
  static async createService(data: { name: string; description?: string; price: number; durationMinutes: number }) {
    return prisma.service.create({
      data,
    });
  }

  // 4. Actualizar servicio (solo Admin/Vet)
  static async updateService(id: string, data: { name?: string; description?: string; price?: number; durationMinutes?: number }) {
    await ServiceService.getServiceById(id);

    return prisma.service.update({
      where: { id },
      data,
    });
  }

  // 5. Eliminar servicio (solo Admin/Vet)
  static async deleteService(id: string) {
    await ServiceService.getServiceById(id);

    return prisma.service.delete({
      where: { id },
    });
  }
}