import express from "express";
import {
  crearProyecto,
  listarProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto,
  obtenerDatosGrafico,
  generarAnalisisIA
} from "../controllers/proyectoController.js";


const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Proyecto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a3e12bfa-4a12-4e3f-9a25-0e9f11a7c2b3"
 *         nombre:
 *           type: string
 *           example: "Sistema de Gestión"
 *         descripcion:
 *           type: string
 *           example: "Proyecto interno para optimizar procesos"
 *         estado:
 *           type: integer
 *           description: "1 = Pendiente, 2 = En progreso, 3 = Finalizado"
 *           example: 2
 *         fechaInicio:
 *           type: string
 *           format: date
 *           example: "2025-10-18"
 *         fechaFin:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 */

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 */
router.get("/", listarProyecto);

/**
 * @swagger
 * /api/proyectos/graficos:
 *   get:
 *     summary: Obtiene los datos agregados para gráficos
 *     description: Devuelve la cantidad de proyectos agrupados por estado.
 *     responses:
 *       200:
 *         description: Datos de gráficos generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: integer
 *                     example: 1
 *                   cantidad:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: Error al generar datos para los gráficos
 */
router.get("/graficos", obtenerDatosGrafico);

/**
 * @swagger
 * /api/proyectos/analisis:
 *   get:
 *     summary: Genera un resumen de las descripciones de proyectos usando IA
 *     description: Utiliza un modelo de IA generativa para analizar y resumir las descripciones de todos los proyectos existentes.
 *     responses:
 *       200:
 *         description: Resumen generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   type: string
 *                   example: "La mayoría de los proyectos están orientados a mejorar la eficiencia interna y automatizar procesos."
 *       500:
 *         description: Error al generar el resumen con IA
 */
router.get("/analisis", generarAnalisisIA);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 */
router.get("/:id", obtenerProyecto);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sistema Interno"
 *               descripcion:
 *                 type: string
 *                 example: "Gestión de procesos internos"
 *               estado:
 *                 type: integer
 *                 example: 1
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-18"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       400:
 *         description: Error al crear el proyecto
 */
router.post("/", crearProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 */
router.put("/:id", actualizarProyecto);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 */
router.delete("/:id", eliminarProyecto);

export default router;


