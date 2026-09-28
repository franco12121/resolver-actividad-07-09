import { Request, Response } from 'express';
import { PedidoService } from '../services/pedido.service.js';

const pedidoService = new PedidoService();

export class PedidoController {
  async crearPedido(req: Request, res: Response): Promise<void> {
    const { usuarioId, productosComprados } = req.body;

    // Validar datos de entrada
    if (!usuarioId || !productosComprados || !Array.isArray(productosComprados) || productosComprados.length === 0) {
      res.status(400).json({ error: 'Información incompleta o inválida en la petición.' });
      return;
    }

    try {
      const pedidoFinalizado = await pedidoService.procesarCheckout(usuarioId, productosComprados);
      // Retorna el pedido finalizado con código 201 Created
      res.status(201).json(pedidoFinalizado);
    } catch (error: any) {
      // Maneja falta de stock o errores de aplicación retornando código 400
      res.status(400).json({ error: error.message });
    }
  }
}
