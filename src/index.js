// ======= Importaciones principales =======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "./config/initDB.js"
import proyectoRoutes from "./routes/proyectoRoutes.js";
import { swaggerDocs } from "./config/swagger.js";


// ======= Configuración inicial =======
dotenv.config();


// ======= Inicializar Express =======
const app = express();


// ======= Middlewares =======
app.use(cors());
app.use(express.json());

// ======= Rutas =======
app.use("/api/proyectos", proyectoRoutes);

// Ruta de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// ======= Activar la documentacion Swagger
swaggerDocs(app);

// ======= Iniciar servidor =======
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  await initDatabase();
});
