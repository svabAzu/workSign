import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.CONECTDB_URL!, {
  models: [__dirname + '/../models/**/*'], // Carga los modelos
  schema: 'public', // Especifica el esquema público
  logging: console.log, // Opción para ver las consultas en la consola (opcional)
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true', // Soporte para SSL si lo necesitas
  },
});

export default db;

