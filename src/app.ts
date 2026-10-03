import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON en el body

// Rutas de la API
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor PetCare listo en http://localhost:${PORT}/api/health`);
});