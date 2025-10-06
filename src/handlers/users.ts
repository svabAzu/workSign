import { Request,Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/Users.models";
import TypeUser from "../models/Type_user.models";
import Specialty from "../models/Specialty.models";
import { Op } from "sequelize";
import sequelize from "../config/db";



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
  
  const t = await sequelize.transaction();
  console.log("--- INICIANDO ACTUALIZACIÓN DE USUARIO ---");
  try {
    const { id } = req.params;
    console.log(`1. ID de usuario a actualizar: ${id}`);
    console.log("2. Datos recibidos (req.body):", req.body);

    const user = await User.findByPk(id, { include: ["specialties"] });

    if (!user) {
      console.log("-> Error: Usuario no encontrado.");
      await t.rollback();
      return res.status(404).json('El usuario no existe');
    }
    console.log("4. Usuario encontrado en la BD:", user.toJSON());

    const { name, last_name, email, phone, dni, ID_type_user, password } = req.body;
    
    // Construir objeto con datos a actualizar para el modelo User
    const updateData: any = { name, last_name, email, phone, dni, ID_type_user };

    // 5. Manejo de la contraseña
    if (password && password.trim() !== '') {
      console.log("-> Se proporcionó nueva contraseña. Hasheando...");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    } else {
      console.log("-> No se proporcionó nueva contraseña o está vacía. Se ignora.");
    }
    
    console.log("7. Datos a actualizar en la tabla Users:", updateData);
    await user.update(updateData, { transaction: t });
    console.log("8. Usuario actualizado en la BD.");

    // 9. Manejo de las especialidades
    let { specialties: specialtyIds } = req.body;
    if (specialtyIds) {
      // Si llega como string '[1,2,3]', lo parseamos
      if (typeof specialtyIds === 'string') {
        try {
          specialtyIds = JSON.parse(specialtyIds);
          console.log("-> Especialidades parseadas de string a array:", specialtyIds);
        } catch (e) {
          console.error("-> Error al parsear 'specialties'. No es un JSON válido.");
          await t.rollback();
          return res.status(400).json({ error: "El formato de 'specialties' es incorrecto." });
        }
      }

      if (Array.isArray(specialtyIds)) {
        console.log("10. IDs de especialidades para asociar:", specialtyIds);
        
        const specialties = await Specialty.findAll({
          where: { ID_specialty: { [Op.in]: specialtyIds } },
          transaction: t
        });
        console.log("11. Especialidades encontradas para asociar:", specialties.map(s => s.toJSON()));
        await user.$set('specialties', specialties, { transaction: t });
        console.log("12. Asociación de especialidades actualizada.");
      }
    } else {
        console.log("-> No se proporcionaron especialidades. No se realizan cambios en ellas.");
    }

    await t.commit();
    console.log("--- TRANSACCIÓN COMPLETADA (COMMIT) ---");

    // 13. Volver a buscar el usuario con las relaciones actualizadas
    const updatedUser = await User.findByPk(id, {
      include: [
        { model: TypeUser, as: 'typeUser' },
        { model: Specialty, as: 'specialties', through: { attributes: [] } }
      ]
    });
    console.log("14. Usuario final con relaciones:", updatedUser?.toJSON());

    res.status(200).json({ data: updatedUser });

  } catch (error) {
    await t.rollback();
    console.error("--- ERROR DURANTE LA ACTUALIZACIÓN (ROLLBACK) ---", error);
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