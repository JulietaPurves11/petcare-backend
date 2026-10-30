import { prisma } from '../config/db';
import { AppointmentStatus } from '@prisma/client';
import { EmailService } from './email.service';

export class AppointmentService {
  // 1. Crear un nuevo turno con validación de horario
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

    const requestedDate = new Date(data.dateTime);

    // Validar que no haya otro turno activo en ese mismo horario exacto
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dateTime: requestedDate,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
    });

    if (existingAppointment) {
      throw new Error('El horario seleccionado ya se encuentra ocupado. Por favor elige otro horario.');
    }

    // Guardar el turno en la DB
    const newAppointment = await prisma.appointment.create({
      data: {
        dateTime: requestedDate,
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

    // Enviar notificación por correo al cliente ANTES del return
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      EmailService.sendAppointmentConfirmation(
        user.email,
        user.fullName,
        pet.name,
        service.name,
        requestedDate
      );
    }

    return newAppointment;
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

  // 4. Cambiar estado de un turno
  static async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('El turno solicitado no existe.');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        user: true,
        pet: true,
      },
    });

    if (updatedAppointment.user) {
      EmailService.sendAppointmentStatusUpdate(
        updatedAppointment.user.email,
        updatedAppointment.user.fullName,
        updatedAppointment.pet.name,
        status
      );
    }

    return updatedAppointment;
  }

  // 5. Consultar horarios disponibles para una fecha y servicio
  static async getAvailableSlots(dateStr: string, serviceId: string) {
    // 1. Obtener la duración del servicio
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error('Servicio no encontrado.');
    }

    const durationMs = service.durationMinutes * 60 * 1000;

    // 2. Definir rango de horario laboral para la fecha dada (09:00 a 18:00 UTC)
    const baseDate = new Date(dateStr);
    const startTime = new Date(baseDate);
    startTime.setUTCHours(9, 0, 0, 0);

    const endTime = new Date(baseDate);
    endTime.setUTCHours(18, 0, 0, 0);

    // 3. Obtener turnos ya reservados para ese día
    const dayStart = new Date(baseDate);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(baseDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        dateTime: { gte: dayStart, lte: dayEnd },
        status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
      },
    });

    // 4. Generar bloques de horarios y filtrar los ocupados
    const availableSlots: string[] = [];
    let currentSlot = startTime;

    while (currentSlot.getTime() + durationMs <= endTime.getTime()) {
      const slotEndTime = new Date(currentSlot.getTime() + durationMs);

      const isOccupied = existingAppointments.some((app) => {
        const appStart = new Date(app.dateTime).getTime();
        const appEnd = appStart + durationMs;
        const slotStart = currentSlot.getTime();
        const slotEnd = slotEndTime.getTime();

        return slotStart < appEnd && slotEnd > appStart;
      });

      if (!isOccupied) {
        availableSlots.push(currentSlot.toISOString());
      }

      currentSlot = new Date(currentSlot.getTime() + durationMs);
    }

    return {
      date: dateStr,
      service: service.name,
      durationMinutes: service.durationMinutes,
      availableSlots,
    };
  }
}