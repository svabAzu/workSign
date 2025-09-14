import { Request,Response } from "express";


import User from "../models/Users.models";
import TypeUser from "../models/Type_user.models"; 
import Specialty from "../models/Specialty.models";
import { Op } from "sequelize";

const postUser = async (req: Request, res: Response) => {
    try {
        // 1. Crear el usuario
        const newUser = await User.create(req.body);

        // Si hay IDs de especialidades en el cuerpo, las asociamos
        const { specialtyIds } = req.body;
        if (specialtyIds && specialtyIds.length > 0) {
            const specialties = await Specialty.findAll({
                where: {
                    ID_specialty: { [Op.in]: specialtyIds }
                }
            });
            await newUser.$set('specialties', specialties);
        }

        // 2. Volver a buscar el usuario recién creado incluyendo las relaciones
        const userWithRelations = await User.findByPk(newUser.dataValues.ID_users, {
            include: [
                {
                    model: TypeUser,
                    as: 'typeUser'
                },
                {
                    model: Specialty,
                    as: 'specialties',
                    through: { attributes: [] }
                }
            ]
        });

        // 3. Devolver la respuesta con las relaciones
        if (userWithRelations) {
            res.status(201).json({ data: userWithRelations });
        } else {
            res.status(201).json({ data: newUser });
        }
    } catch (error) {
        console.error("Error al crear el usuario y sus relaciones:", error);
        res.status(500).json({ error: "Error al crear el usuario." });
    }
}



const getUser = async (req: Request, res: Response) => {
    try {
        // Usa findAll() con la opción include para traer las relaciones
        const users = await User.findAll({
            include: [
                {
                    model: TypeUser,
                    as: 'typeUser' 
                },
                {
                    model: Specialty,
                    as: 'specialties', 
                    through: { attributes: [] } // Excluye los atributos de la tabla intermedia
                }
            ]
        });
        res.status(200).json({ data: users });
    } catch (error) {
        console.error("Error al obtener los usuarios con relaciones:", error);
        res.status(500).json({ error: "Error al obtener los usuarios." });
    }
}

const getUserForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Usa findByPk() con la opción include para traer las relaciones
        const user = await User.findByPk(id, {
            include: [
                {
                    model: TypeUser,
                    as: 'typeUser'
                },
                {
                    model: Specialty,
                    as: 'specialties',
                    through: { attributes: [] }
                }
            ]
        });
        if (!user) {
            return res.status(404).json('El usuario no existe');
        }
        res.status(200).json({ data: user });
    } catch (error) {
        console.error("Error al obtener el usuario por ID con relaciones:", error);
        res.status(500).json({ error: "Error al obtener el usuario por ID." });
    }
}

const putUserForId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json('El usuario no existe');
        }
        // Actualiza el usuario con los datos del body
        await user.update(req.body);
        // Responde con el usuario actualizado
        res.status(200).json({ data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario." });
    }
}

const getOperators = async (req: Request, res: Response) => {
    try {
        const operators = await User.findAll({
            where: {
                ID_type_user: 2
            },
            include: [
                {
                    model: TypeUser,
                    as: 'typeUser'
                },
                {
                    model: Specialty,
                    as: 'specialties',
                    through: { attributes: [] }
                }
            ]
        });
        res.status(200).json({ data: operators });
    } catch (error) {
        console.error("Error al obtener los operadores:", error);
        res.status(500).json({ error: "Error al obtener los operadores." });
    }
}

export {
    postUser,
    getUser,
    getUserForId,
    putUserForId,
    getOperators
}