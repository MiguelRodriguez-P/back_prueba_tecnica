import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Proyecto = sequelize.define(
    "Proyecto",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "El nombre es necesario" },
            },
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "El descripción es necesario" },
            },
        },

        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[1, 2, 3]],
                    msg: "El estado es necesario y tiene que 1, 2 o 3",
                },
            },
        },

        fechaInicio: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        fechaFin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "proyectos",
        timestamps: false,
    }
);

export default Proyecto;