import { prisma } from '../config/prisma.js';

interface ProductoComprado {
  productoId: number;
  cantidad: number;
}

export class PedidoService {
  async procesarCheckout(usuarioId: number, productosSolicitados: ProductoComprado[]) {
    // SE QUITO LA BARRA INVERTIDA ANTES DE \$transaction
    return await prisma.$transaction(async (tx) => {

      
      // 1. Crear el pedido inicial asignando el usuarioId
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuarioId: usuarioId,
          total: 0.0,
        },
      });

      let totalCalculado = 0;

      // 2. Recorrer los productos solicitados para descontar el stock
      for (const item of productosSolicitados) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) {
          throw new Error(`El producto con ID ${item.productoId} no existe.`);
        }

        const stockResultante = producto.stock - item.cantidad;

        // Validación crítica: si queda en negativo lanza error para provocar el ROLLBACK
        if (stockResultante < 0) {
          throw new Error(`Stock insuficiente para el producto: ${producto.nombre}. Solicitado: ${item.cantidad}, Disponible: ${producto.stock}`);
        }

        // Restar inventario modificando el atributo stock
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: stockResultante },
        });

        // Crear el registro en DetallePedido
        await tx.detallePedido.create({
          data: {
            pedidoId: nuevoPedido.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precioUnit: producto.precio,
          },
        });

        totalCalculado += producto.precio * item.cantidad;
      }

      // 3. Si todo es exitoso, actualiza el Pedido con el total y hace COMMIT implícito
      return await tx.pedido.update({
        where: { id: nuevoPedido.id },
        data: { total: totalCalculado },
        include: { detallePedidos: true },
      });
    });
  }
}
