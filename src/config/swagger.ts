import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.2.0',
    info: {
      title: 'E-commerce API con Prisma y Swagger',
      version: '1.0.0',
      description: 'Documentación interactiva del contrato digital de la API.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/config/swagger.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductoItem:
 *       type: object
 *       required:
 *         - productoId
 *         - cantidad
 *       properties:
 *         productoId:
 *           type: integer
 *           example: 1
 *         cantidad:
 *           type: integer
 *           example: 2
 *     PedidoDTO:
 *       type: object
 *       required:
 *         - usuarioId
 *         - productosComprados
 *       properties:
 *         usuarioId:
 *           type: integer
 *           example: 5
 *         productosComprados:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoItem'
 */
