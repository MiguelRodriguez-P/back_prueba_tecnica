import sequelize from "./database.js";
import Proyecto from "../models/Proyecto.js";


// ======= Conexión con la base de datos =======
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");

    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas con la base de datos.");

  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
};