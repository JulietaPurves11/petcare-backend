import { prisma } from '../config/db';
import { RecordType } from '@prisma/client';

export class MedicalRecordService {
  // 1. Registrar una consulta, vacuna o tratamiento
  static async createRecord(data: {
    petId: string;
    type: RecordType;
    title: string;
    appliedDate?: string;
    dueDate?: string;
    notes?: string;
    veterinarian?: string;
  }) {
    // Verificar que la mascota exista
    const pet = await prisma.pet.findUnique({
      where: { id: data.petId },
    });

    if (!pet) {
      throw new Error('La mascota especificada no existe.');
    }

    return prisma.medicalRecord.create({
      data: {
        petId: data.petId,
        type: data.type,
        title: data.title,
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes,
        veterinarian: data.veterinarian,
      },
      include: {
        pet: { select: { name: true, species: true } },
      },
    });
  }

  // 2. Obtener historial médico de una mascota
  static async getRecordsByPet(petId: string, userId: string, userRole: string) {
    // Si el usuario es un cliente, validamos que la mascota sea suya
    if (userRole === 'CLIENT') {
      const pet = await prisma.pet.findFirst({
        where: { id: petId, ownerId: userId },
      });

      if (!pet) {
        throw new Error('Mascota no encontrada o no tienes permisos para ver su historial.');
      }
    }

    return prisma.medicalRecord.findMany({
      where: { petId },
      orderBy: { appliedDate: 'desc' },
    });
  }

  // 3. Eliminar un registro médico (Solo Admin)
  static async deleteRecord(recordId: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      throw new Error('El registro médico no existe.');
    }

    return prisma.medicalRecord.delete({
      where: { id: recordId },
    });
  }
}