import User from "../models/Users.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Specialty from "../models/Specialty.models"; // Importa el modelo Specialty
import TypeUser from "../models/Type_user.models";
import fs from 'fs';
import path from 'path';

export const register = async (req, res) => {
    // Parseo los datos para asegurar los tipos correctos
    const name = req.body.name;
    const last_name = req.body.last_name;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
   const state = req.body.state === undefined ? true : req.body.state === 'true' || req.body.state === true;
    const dni = Number(req.body.dni);
    const ID_type_user = Number(req.body.ID_type_user);
    let specialtyIds = req.body.specialties;
    // Si specialties viene como string (ej: '[1,2]'), lo parseo
    if (typeof specialtyIds === 'string') {
        try {
            specialtyIds = JSON.parse(specialtyIds);
        } catch {
            specialtyIds = [];
        }
    }
    // El archivo avatar se recibe por multer
    const avatarFile = req.file;
    let avatarTempPath = avatarFile ? avatarFile.path : null;

    try {
        const userFound = await User.findOne({
            where: { email: email }
        });
        if (userFound) {
            if (avatarTempPath && fs.existsSync(avatarTempPath)) {
                fs.unlinkSync(avatarTempPath);
            }
            return res.status(400).json(['Email ya está en uso']);
        }

        if (!password) {
            if (avatarTempPath && fs.existsSync(avatarTempPath)) {
                fs.unlinkSync(avatarTempPath);
            }
            return res.status(400).json(["Password es requerida"]);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Creamos el usuario sin avatar_url
        const newUser = new User({
            name,
            last_name,
            password: passwordHash,
            dni,
            phone,
            email,
            state,
            ID_type_user,
        });

        const userSaved = await newUser.save();
        const newUserId = userSaved.dataValues.ID_users;

        // Si se subió avatar, lo renombramos con el ID del usuario SOLO si el usuario se creó correctamente
        let avatar_url = '';
        if (avatarFile && fs.existsSync(avatarTempPath)) {
            const ext = path.extname(avatarFile.originalname);
            const newFileName = `${newUserId}${ext}`;
            const newPath = path.join(path.dirname(avatarTempPath), newFileName);
            fs.renameSync(avatarTempPath, newPath);
            avatar_url = `uploads/avatars/${newFileName}`;
            await userSaved.update({ avatar_url });
        }

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

        if (!userWithRelations) {
            // Si el usuario no se recupera, elimina el avatar si existe
            if (avatar_url) {
                const avatarFullPath = path.join(__dirname, '../../', avatar_url);
                if (fs.existsSync(avatarFullPath)) {
                    fs.unlinkSync(avatarFullPath);
                }
            }
            return res.status(500).json(["Error interno: No se pudo recuperar el usuario recién creado con sus relaciones."]);
        }

        res.status(201).json(userWithRelations.toJSON());

    } catch (error) {
        // Si el archivo fue subido, lo eliminamos porque hubo error
        if (avatarTempPath && fs.existsSync(avatarTempPath)) {
            fs.unlinkSync(avatarTempPath);
        }
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
            attributes: ['ID_users', 'name', 'last_name', 'password', 'email', 'dni', 'phone', 'avatar_url', 'state', 'createdAt'] // Asegúrate de listar todas las columnas necesarias
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
                last_name: userFound.dataValues.last_name,
                DNI: userFound.dataValues.dni,
                avatar_url: userFound.dataValues.avatar_url,
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
        last_name: userFound.dataValues.last_name,
        DNI: userFound.dataValues.dni,
        avatar_url: userFound.dataValues.avatar_url,
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
            last_name: userFound.dataValues.last_name,
            DNI: userFound.dataValues.dni,
            avatar_url: userFound.dataValues.avatar_url,
            phone: userFound.dataValues.phone,
            specialties: userFound.dataValues.specialties, // Las especialidades asociadas
            ID_type_user: userFound.dataValues.ID_type_user,
            email: userFound.dataValues.email,
            state: userFound.dataValues.state,
            createdAt: userFound.dataValues.createdAt,
        });
    });
};