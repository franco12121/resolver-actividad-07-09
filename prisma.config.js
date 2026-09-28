module.exports = {
  $prismaConfig: true,
  orm: {
    family: 'sql',
    target: 'postgres',
    adapter: 'postgres',
    db: {
      connection: process.env.DATABASE_URL || "postgresql://postgres:miprimo2@localhost:5432/catedra_backend?schema=public"
    },
    contract: {
      schema: './prisma/schema.prisma'
    }
  }
};
