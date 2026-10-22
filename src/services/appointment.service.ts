import { prisma } from '../config/db';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentService {
  // 1. Crear un nuevo turno (Cliente)
  static async createAppointment(userId: string, data: { petId: string; serviceId: string; dateTime: string; notes?: string }) {
    // Validar que la mascota exista y pertenezca al usuario logueado
    const pet = await prisma.pet.findFirst({
      where: { id: data.petId, ownerId: userId },
    });

    if (!pet) {
      throw new Error('La mascota seleccionada no existe o no te pertenece.');
    }

    // Validar que el servicio exista
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new Error('El servicio seleccionado no existe.');
    }

    // Guardar el turno en la DB
    return prisma.appointment.create({
      data: {
        dateTime: new Date(data.dateTime),
        notes: data.notes,
        userId: userId,
        petId: data.petId,
        serviceId: data.serviceId,
        status: AppointmentStatus.PENDING,
      },
      include: {
        pet: { select: { name: true, species: true } },
        service: { select: { name: true, price: true, durationMinutes: true } },
      },
    });
  }

  // 2. Listar turnos de un cliente específico
  static async getAppointmentsByUser(userId: string) {
    return prisma.appointment.findMany({
      where: { userId },
      include: {
        pet: { select: { name: true, species: true } },
        service: { select: { name: true, price: true, durationMinutes: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
  }

  // 3. Listar agenda completa (Solo para vista Admin / Vet)
  static async getAllAppointments() {
    return prisma.appointment.findMany({
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        pet: { select: { name: true, species: true } },
        service: { select: { name: true, price: true, durationMinutes: true } },
      },
      orderBy: { dateTime: 'asc' },
    });
  }

  // 4. Cambiar estado de un turno (CONFIRMED, COMPLETED, CANCELLED)
  static async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('El turno solicitado no existe.');
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }
}