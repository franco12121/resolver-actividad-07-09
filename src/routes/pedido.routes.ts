import { Router } from 'express';
import { PedidoController } from '../controllers/pedido.controller.js';

const router = Router();
const pedidoController = new PedidoController();

/**
 * @openapi
 * /pedidos:
 *   post:
 *     summary: Procesar checkout de compras
 *     description: Endpoint que reduce de forma atómica el stock del inventario y registra un pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoDTO'
 *     responses:
 *       201:
 *         description: Pedido procesado con éxito y confirmación de la transacción.
 *       400:
 *         description: Error de solicitud por información inválida o falta de stock (Gatilla Rollback).
 *       422:
 *         description: Datos con formato incorrecto.
 */
router.post('/', pedidoController.crearPedido);

export default router;
