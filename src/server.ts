import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import pedidoRouter from './routes/pedido.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Integración de Swagger UI como middleware para pruebas interactivas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrar la Capa de Red con su prefijo
app.use('/api/pedidos', pedidoRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo de forma exitosa en: http://localhost:${PORT}`);
  console.log(`📄 Interfaz interactiva de Swagger disponible en: http://localhost:${PORT}/api-docs`);
});
