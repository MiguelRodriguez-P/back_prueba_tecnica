import { Sequelize, Op } from "sequelize";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Proyecto from "../models/Proyecto.js";


// ======= crear proyecto
export const crearProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;
        
        // validamos campos requeridos
        if (!nombre || !descripcion || !estado) {
            return res.status(400).json({
                error: "Faltan datos necesarios para crear el proyecto",
            });
        }

        // creamos el proyecto
        const proyecto = await Proyecto.create(req.body);
        res.status(201).json(proyecto);
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            error: error.errors?.[0]?.message || "Error al crear el proyecto",
        });
    }
};


// ======= listar proyectos
export const listarProyecto = async (req, res) => {
  try {
    // obtenemos los filtros del front
    const { estado, nombre, fechaInicio, fechaFin } = req.query;

    const where = {};

    // filtros opcionales
    if (estado) where.estado = estado;
    if (nombre) where.nombre = { [Op.iLike]: `%${nombre}%` }; // búsqueda parcial
    if (fechaInicio && fechaFin) where.fechaInicio = { [Op.between]: [fechaInicio, fechaFin] };

    // obtenemos todos los registros sin paginación
    const proyectos = await Proyecto.findAll({
      where,
      order: [["fechaInicio", "DESC"]],
    });

    res.json(proyectos);
  } catch (error) {
    console.error("Error al listar proyectos: ", error);
    res.status(500).json({ error: "Error al listar los proyectos" });
  }
};


// ======= obtener un proyecto por ID
export const obtenerProyecto = async (req, res) => {
    try {
        // buscamos un proyecto por ID
        const proyecto = await Proyecto.findByPk(req.params.id);
        if (!proyecto) return res.status(404).json({ error: "Proyectos no encontrado" });
        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el proyecto" });
    }
};


// ======= actualizar un proyecto
export const actualizarProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByPk(req.params.id);
        if (!proyecto) return res.status(404).json({ error: "Proyectos no encontrado" });

        // definimos los campos actualizables
        const camposActualizados = [
            "nombre",
            "descripcion",
            "estado",
            "fechaInicio",
            "fechaFin",
        ];

        // verificamos los campos modificados
        for (const campo of camposActualizados) {
            if (req.body[campo] !== undefined ) {
                proyecto[campo] = req.body[campo];
            }
        }

        // aplicamos los cambios
        await proyecto.save();    
        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
};


// ======= eliminar un proyecto
export const eliminarProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findByPk(req.params.id);
        if (!proyecto) return res.status(404).json({ error: "Proyectos no encontrado" });

        await proyecto.destroy();    
        res.json({ message: "Proyecto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
};


// ======= datos para el grafico
export const obtenerDatosGrafico = async (req, res) => {
    try {
        // contar la cantidad de estados y los agrupamos por estado (1, 2, 3) en ascendente
        const resultados = await Proyecto.findAll({
            attributes: [
                "estado",
                [Sequelize.fn("COUNT", Sequelize.col("estado")), "cantidad"],
            ],
            group: ["estado"],
            order: [["estado", "ASC"]],
        });
        res.json(resultados);
    } catch (error) {
        console.error("Error al generar datos de graficos: ", error);
        res.status(500).json({ error: "Error al generar datos para los graficos" });
    }
};


// ======= resumen con IA generativa
export const generarAnalisisIA = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll({
            attributes: ["nombre", "descripcion"],
        });

        // verificamos no tenemos datos en DB
        if (proyectos.length === 0) {
            return res.status(200).json({ resume: "No hay proyectos para analizar" });
        }

        // concatenamos todas las descripciones
        const texto = proyectos
            .map((p, i) => `${i+1}. ${p.nombre}: ${p.descripcion}`)
            .join("\n");

        // inicializamos el cliente de Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Prompt para generar el resumen
        const prompt = `Analiza los siguientes proyectos y genera un resumen general de sus descripciones destacando los temas principales y objetivos comunes: 
        ${texto}
        `;

        // realizamos la consulata con la IA
        const result = await model.generateContent(prompt);
        const respuesta = result.response.text();

        // retornamos la respuesta
        res.json({ resume: respuesta });
    } catch (error) {
        console.error("Error al generar resumen con IA: ", error);
        res.status(500).json({ error: "Error al generar resumen con IA" });
    }
};
