1. Autenticación (/api/auth)

    POST /api/auth/register: Registro de usuario (cliente).

    POST /api/auth/login: Inicio de sesión y devolución de Token JWT.

    GET /api/auth/me: Obtener los datos del usuario autenticado.

2. Mascotas (/api/pets)

    GET /api/pets: Listar las mascotas del usuario logueado.

    POST /api/pets: Crear una nueva mascota.

    GET /api/pets/:id: Obtener el detalle y carnet de una mascota.

    PUT /api/pets/:id: Actualizar datos de la mascota.

    DELETE /api/pets/:id: Eliminar mascota.

3. Servicios (/api/services)

    GET /api/services: Listar el catálogo de servicios (público/cliente).

    POST /api/services: Crear un nuevo servicio (solo Admin).

    PUT /api/services/:id: Editar un servicio (solo Admin).

4. Turnos (/api/appointments)

    GET /api/appointments/my-appointments: Listar turnos del cliente logueado.

    POST /api/appointments: Reservar un nuevo turno.

    GET /api/appointments: Listar todos los turnos del día/semana (solo Admin/Vet).

    PATCH /api/appointments/:id/status: Cambiar estado del turno (CONFIRMED, COMPLETED, CANCELLED).

5. Carnet / Historial Médico (/api/medical-records)

    GET /api/medical-records/pet/:petId: Obtener la historia clínica/vacunas de una mascota.

    POST /api/medical-records: Registrar una nueva vacuna o consulta (solo Vet/Admin).