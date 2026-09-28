import { Client } from 'pg';

async function main() {
  console.log('⚡ Iniciando conexión directa por SQL puro...');
  
  const connectionString = "postgresql://postgres:miprimo2@localhost:5432/catedra_backend?schema=public";
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL de forma exitosa.');

    console.log('🛠️ Creando tablas físicas de la Consigna 2 en la base de datos...');
    
    // 1. Crear las tablas si no existen con SQL Nativo (Estructura de la Consigna 2)
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Usuario" (
        "id" SERIAL PRIMARY KEY,
        "nombre" TEXT NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "Producto" (
        "id" SERIAL PRIMARY KEY,
        "nombre" TEXT NOT NULL,
        "precio" DOUBLE PRECISION NOT NULL,
        "stock" INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "Pedido" (
        "id" SERIAL PRIMARY KEY,
        "total" DOUBLE PRECISION DEFAULT 0.0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "usuarioId" INTEGER NOT NULL REFERENCES "Usuario"("id") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "DetallePedido" (
        "id" SERIAL PRIMARY KEY,
        "cantidad" INTEGER NOT NULL,
        "precioUnit" DOUBLE PRECISION NOT NULL,
        "pedidoId" INTEGER NOT NULL REFERENCES "Pedido"("id") ON DELETE CASCADE,
        "productoId" INTEGER NOT NULL REFERENCES "Producto"("id") ON DELETE RESTRICT
      );
    `);
    console.log('✅ Estructuras y relaciones (claves foráneas) creadas con éxito.');

    // 2. Limpiar registros previos para evitar duplicados en pruebas
    console.log('🧹 Limpiando registros antiguos...');
    await client.query('TRUNCATE "DetallePedido", "Pedido", "Producto", "Usuario" RESTART IDENTITY CASCADE;');

    // 3. Cargar Usuarios de Prueba
    console.log('🌱 Insertando datos de prueba...');
    await client.query(`
      INSERT INTO "Usuario" ("nombre", "email") VALUES 
      ('Juan Pérez', 'juan.perez@example.com'),
      ('María López', 'maria.lopez@example.com');
    `);

    // 4. Cargar Productos de Prueba con Stock inicial
    await client.query(`
      INSERT INTO "Producto" ("nombre", "precio", "stock") VALUES 
      ('Teclado Mecánico RGB', 45000.0, 15),
      ('Mouse Gamer Inalámbrico', 25000.0, 30),
      ('Monitor 24" Full HD', 120000.0, 5),
      ('Auriculares con Micrófono', 32000.0, 0);
    `);

    console.log('✨ Base de datos estructurada y poblada al 100%.');
  } catch (error) {
    console.error('❌ Error ejecutando el script SQL:', error);
  } finally {
    await client.end();
  }
}

main();
