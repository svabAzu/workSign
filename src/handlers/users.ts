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
    const operators = await User.findAll({
      where: { ID_type_user: 2 }, // 🔹 Filtro solo operadores
      include: [
        {
          model: TypeUser,
          as: "typeUser",
        },
        {
          model: Specialty,
          as: "specialties",
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({ data: operators });
  } catch (error) {
    console.error("Error al obtener los usuarios operadores:", error);
    res.status(500).json({ error: "Error al obtener los usuarios operadores." });
  }
};




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
    console.log("--- INICIANDO ACTUALIZACIÓN DE USUARIO ---");
  try {
    const { id } = req.params;
        console.log(`1. ID de usuario a actualizar: ${id}`);
        console.log("2. Datos recibidos (req.body):", req.body);

    const user = await User.findByPk(id);

    if (!user) {
            console.log("-> Error: Usuario no encontrado.");
            return res.status(404).json('El usuario no existe');
    }
        console.log("3. Usuario encontrado en la BD:", user.toJSON());

        // Clona el body para no modificar el original
        const updateData = { ...req.body };
        // Elimina specialtyIds para que no se intente actualizar en la tabla de usuarios
        delete updateData.specialtyIds;
        console.log("4. Datos a actualizar en la tabla Users (sin specialtyIds):", updateData);

        // Actualiza el usuario con los datos del body
        await user.update(updateData);
        console.log("5. Usuario actualizado en la BD.");

    // Si hay IDs de especialidades en el cuerpo, las actualizamos
    const { specialtyIds } = req.body;
    if (specialtyIds && Array.isArray(specialtyIds)) {
            console.log("6. IDs de especialidades recibidos:", specialtyIds);
      const specialties = await Specialty.findAll({
        where: {
                    ID_specialty: { [Op.in]: specialtyIds }
                }
      });
            console.log("7. Especialidades encontradas para asociar:", specialties.map(s => s.toJSON()));
            await user.$set('specialties', specialties);
            console.log("8. Asociación de especialidades actualizada.");
    }

    // Volver a buscar el usuario con las relaciones actualizadas
        console.log("9. Volviendo a buscar el usuario con todas las relaciones...");
    const updatedUser = await User.findByPk(id, {
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
        console.log("10. Usuario final con relaciones:", updatedUser?.toJSON());

    // Responde con el usuario actualizado
        console.log("--- ACTUALIZACIÓN COMPLETADA EXITOSAMENTE ---");
    res.status(200).json({ data: updatedUser });
  } catch (error) {
        console.error("--- ERROR DURANTE LA ACTUALIZACIÓN ---", error);
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
}

const getOperators = async (req: Request, res: Response) => {
  try {
    const operators = await User.findAll({
      // Se elimina la propiedad 'where' para no aplicar ningún filtro
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
    // Nota: Si ahora obtienes todos los usuarios, quizá el nombre de la función
    // 'getOperators' no sea el más adecuado. Podrías renombrarla a 'getAllUsers'.
    res.status(200).json({ data: operators });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios." });
  }
}

export {
    postUser,
    getUser,
    getUserForId,
    putUserForId,
    getOperators
}