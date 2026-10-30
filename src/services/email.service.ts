import nodemailer from 'nodemailer';

// Transporter configurable con bypass TLS para entorno de desarrollo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true para puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Permite certificados no verificados en desarrollo
  },
});

export class EmailService {
  // 1. Email de Bienvenida al Registrarse
  static async sendWelcomeEmail(toEmail: string, userName: string) {
    if (!process.env.SMTP_USER) return;

    try {
      await transporter.sendMail({
        from: `"PetCare 🐾" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: '¡Bienvenido a PetCare!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4A90E2;">¡Hola, ${userName}! 🐾</h2>
            <p>Gracias por registrarte en <strong>PetCare</strong>. Tu cuenta ha sido creada con éxito.</p>
            <p>Ya puedes gestionar tus mascotas, agendar turnos y consultar sus historiales médicos desde nuestra plataforma.</p>
            <br>
            <p>Saludos,<br>El equipo de PetCare</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error al enviar email de bienvenida:', error);
    }
  }

  // 2. Email de Confirmación de Reserva de Turno
  static async sendAppointmentConfirmation(toEmail: string, userName: string, petName: string, serviceName: string, dateTime: Date) {
    if (!process.env.SMTP_USER) return;

    const formattedDate = new Date(dateTime).toLocaleString('es-AR', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    try {
      await transporter.sendMail({
        from: `"PetCare 🐾" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Confirmación de Turno para ${petName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4A90E2;">¡Hola, ${userName}! 📅</h2>
            <p>Tu turno ha sido registrado correctamente en el sistema.</p>
            <ul>
              <li><strong>Mascota:</strong> ${petName}</li>
              <li><strong>Servicio:</strong> ${serviceName}</li>
              <li><strong>Fecha y Hora:</strong> ${formattedDate}</li>
            </ul>
            <p>Te esperamos a tiempo. ¡Que tengas un excelente día!</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error al enviar email de confirmación de turno:', error);
    }
  }

  // 3. Email de Cambio de Estado del Turno
  static async sendAppointmentStatusUpdate(toEmail: string, userName: string, petName: string, status: string) {
    if (!process.env.SMTP_USER) return;

    try {
      await transporter.sendMail({
        from: `"PetCare 🐾" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Actualización de Turno para ${petName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4A90E2;">Hola, ${userName}</h2>
            <p>Queremos informarte que el estado de tu turno para <strong>${petName}</strong> ha cambiado a: <strong style="text-transform: uppercase;">${status}</strong>.</p>
            <br>
            <p>Saludos,<br>El equipo de PetCare</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error al enviar email de actualización de estado:', error);
    }
  }
}