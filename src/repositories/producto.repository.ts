import { prisma } from '../config/prisma.js';

export class ProductoRepository {
  async findById(id: number) {
    return prisma.producto.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.producto.findMany();
  }
}
