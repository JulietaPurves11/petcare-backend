import { prisma } from '../config/db';

export class PetService {
  // 1. Crear mascota vinculada al dueño
  static async createPet(ownerId: string, data: { name: string; species: string; breed?: string; birthDate?: string; weight?: number; photoUrl?: string }) {
    return prisma.pet.create({
      data: {
        name: data.name,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        weight: data.weight,
        photoUrl: data.photoUrl,
        ownerId: ownerId,
      },
    });
  }

  // 2. Obtener todas las mascotas del usuario
  static async getPetsByOwner(ownerId: string) {
    return prisma.pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Obtener una mascota por ID (verificando que pertenezca al usuario)
  static async getPetById(petId: string, ownerId: string) {
    const pet = await prisma.pet.findFirst({
      where: {
        id: petId,
        ownerId: ownerId,
      },
      include: {
        medicalRecords: true, // Incluimos su historial si lo tuviera
      },
    });

    if (!pet) {
      throw new Error('Mascota no encontrada o no tienes permisos para verla.');
    }

    return pet;
  }

  // 4. Actualizar datos de una mascota
  static async updatePet(petId: string, ownerId: string, data: { name?: string; species?: string; breed?: string; birthDate?: string; weight?: number; photoUrl?: string }) {
    // Primero verificamos que exista y sea del dueño
    await PetService.getPetById(petId, ownerId);

    return prisma.pet.update({
      where: { id: petId },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });
  }

  // 5. Eliminar mascota
  static async deletePet(petId: string, ownerId: string) {
    await PetService.getPetById(petId, ownerId);

    return prisma.pet.delete({
      where: { id: petId },
    });
  }
}