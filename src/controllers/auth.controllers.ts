import User from "../models/Users.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Specialty from "../models/Specialty.models"; // Importa el modelo Specialty
import TypeUser from "../models/Type_user.models";
// import UsersSpecialty from "../models/UsersSpecialty.models"; 

export const register = async (req, res) => {
    const { name, password, email, phone, state, specialties: specialtyIds, ID_type_user } = req.body;

    try {
        const userFound = await User.findOne({
            where: { email: email }
        });
        if (userFound) {
            return res.status(400).json(['Email ya está en uso']);
        }

        if (!password) {
            return res.status(400).json(["Password es requerida"]);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            password: passwordHash,
            phone,
            email,
            state,
            ID_type_user,
        });

        const userSaved = await newUser.save();


        const newUserId = userSaved.dataValues.ID_users;

        // console.log("User saved:", userSaved.toJSON());
        //console.log("ID of saved user (using newUserId variable):", newUserId);

        if (specialtyIds && specialtyIds.length > 0) {
            const existingSpecialties = await Specialty.findAll({
                where: {
                    ID_specialty: specialtyIds
                }
            });
            await userSaved.$set('specialties', existingSpecialties);
        }

        // Recupera el usuario recién creado con sus relaciones
        const userWithRelations = await User.findByPk(newUserId, {
            include: [
                {
                    model: Specialty,
                    through: { attributes: [] }
                },
                {
                    model: TypeUser
                }
            ]
        });

        //console.log("User with relations (before toJSON):", userWithRelations);

        if (!userWithRelations) {
            console.error("findByPk devolvió null para el usuario con ID:", newUserId);
            return res.status(500).json(["Error interno: No se pudo recuperar el usuario recién creado con sus relaciones."]);
        }

        res.status(201).json(userWithRelations.toJSON());

    } catch (error) {
        console.error("****************** ERROR DETECTADO ******************");
        console.error("Mensaje de error:", error.message);
        console.error("Nombre del error:", error.name);
        console.error("Stack trace:", error.stack);
        console.error("Objeto error completo:", error);
        console.error("***************************************************");
        res.status(500).json(["Error al guardar el usuario o asociar especialidades"]);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({
            where: { email: email },
            // IMPORTANTE: Incluye las especialidades aquí si quieres acceder a ellas al iniciar sesión
            include: [{
                model: Specialty,
                through: { attributes: [] } // Esto asegura que no se incluyan columnas de la tabla intermedia
            }, {
                model: TypeUser,

            }],
            attributes: ['ID_users', 'name', 'password', 'email', 'phone', 'state', 'createdAt'] // Asegúrate de listar todas las columnas necesarias
        });

        if (!userFound) return res.status(404).json(["Usuario no encontrado"]);

        // Verificar si la contraseña fue recuperada (Esto es un console.log de depuración)
        //console.log("Password recuperada:", userFound.dataValues.password);

        if (!userFound.dataValues.password) {
            return res.status(400).json(["Password no establecida para este usuario"]);
        }

        const isMatch = await bcrypt.compare(
            password,
            userFound.dataValues.password
        );

        if (!isMatch) return res.status(404).json(["Contraseña incorrecta"]);

        // Log para depuración: mostrar el ID del usuario antes de crear el token
        //console.log("ID_users para el token:", userFound.dataValues.ID_users);

        jwt.sign({
            id: userFound.dataValues.ID_users, // Usa ID_users
        }, process.env.TOKEN_SECRET, {
            expiresIn: "15m",
        }, (err, token) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error al generar el token" });
            }
            res.cookie('token', token);

            // Al enviar el usuario, podrías enviar también las especialidades
            // userFound.toJSON() es útil para obtener un objeto plano con las relaciones
            res.json({
                id: userFound.dataValues.ID_users, // Usa ID_users
                name: userFound.dataValues.name,
                phone: userFound.dataValues.phone,
                specialties: userFound.dataValues.specialties, // Las especialidades ahora se obtienen directamente aquí
                ID_type_user: userFound.dataValues.typeUser, // Mantienes esta propiedad
                email: userFound.dataValues.email,
                state: userFound.dataValues.state,
                createdAt: userFound.dataValues.createdAt // Sequelize usa createdAt/updatedAt por defecto
            });
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(["Error del servidor"]);
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    // Asumiendo que req.decoded.id contiene el ID del usuario
    const userFound = await User.findByPk(req.decoded.id, {
        include: [{
            model: Specialty,
            through: { attributes: [] } // Para obtener las especialidades asociadas
        },
            // Si tienes la relación con TypeUser y quieres incluirla en el perfil:
            // { model: TypeUser }
        ]
    });

    if (!userFound) return res.status(400).json({ message: 'User not found' });

    res.json({
        id: userFound.dataValues.ID_users, // Usa ID_users
        name: userFound.dataValues.name,
        phone: userFound.dataValues.phone,
        specialties: userFound.dataValues.specialties, // Las especialidades ahora se obtienen directamente aquí
        ID_type_user: userFound.dataValues.typeUser, // Mantienes esta propiedad
        email: userFound.dataValues.email,
        state: userFound.dataValues.state,
        createdAt: userFound.dataValues.createdAt // Sequelize usa createdAt/updatedAt por defecto
    });
};


export const verify = async (req, res) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json(['No autorizado']);

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json(['No autorizado']);

        const userFound = await User.findByPk(user.id, { // user.id debería ser ID_users
            include: [{
                model: Specialty,
                through: { attributes: [] }
            }]
        });
        if (!userFound) return res.status(401).json(['No autorizado']);

        return res.json({
            id: userFound.dataValues.ID_users, // Usa ID_users
            name: userFound.dataValues.name, // Ajustado a 'name'
            phone: userFound.dataValues.phone,
            specialties: userFound.dataValues.specialties, // Las especialidades asociadas
            ID_type_user: userFound.dataValues.ID_type_user,
            email: userFound.dataValues.email,
            state: userFound.dataValues.state,
            createdAt: userFound.dataValues.createdAt,
        });
    });
};