import User from "../models/Users.models";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { name, password, email, phone, state, roleId } =
        req.body;

    try {

        const userFound = await User.findOne({
            where: { email: email }
        })
        if (userFound) return res.status(400).json(['Email ya esta en uso'])

        if (!password) {
            return res.status(400).json(["Password es requerida"]);
        }

        // Encriptar la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            password: passwordHash, // Almacena el hash de la contraseña
            phone,
            email,
            state,
            roleId,
        });
        const userSaved = await newUser.save();


        // jwt.sign({
        //     id: userSaved.id,
        // }, process.env.TOKEN_SECRET, {
        //     expiresIn: "1d",
        // }, (err, token) => {
        //     if (err) console.log(err);
        //     res.cookie('token', token);
        res.send(userSaved);
        // });

    } catch (error) {
        console.log(error);
        res.status(500).json(["Error al guardar el usuario - Posible correo repetido"]);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        const userFound = await User.findOne({
            where: { email: email },
            attributes: ['id', 'full_name', 'surname', 'password', 'email', 'roleId']
        });


        if (!userFound) return res.status(404).json(["Usuario no encontrado"]);

        // Verificar si la contraseña fue recuperada
        console.log("Password recuperada:", userFound.dataValues.password);

        if (!userFound.dataValues.password) {
            return res.status(400).json(["Password not set for this user"]);
        }

        const isMatch = await bcrypt.compare(
            password,
            userFound.dataValues.password
        );

        if (!isMatch) return res.status(404).json(["Contraseña incorrecta"]);


        // jwt.sign({
        //     id: userFound.id,
        // }, process.env.TOKEN_SECRET, {
        //     expiresIn: "1d",
        // }, (err, token) => {
        //     if (err) console.log(err);
        //     res.cookie('token', token);
        //     res.send(userFound);
        // });
        jwt.sign({
            id: userFound.id,
        }, "some secret key", {
            expiresIn: "1d",
        }, (err, token) => {
            if (err) console.log(err);
            res.cookie('token', token);
            res.send(userFound);
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(["Server error"]);
    }

};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {

    const UserFound = await User.findByPk(req.decoded.id)

    if (!UserFound) return res.status(400).json({ message: 'User not found' })



    res.json({
        id: UserFound.dataValues.id,
        full_name: UserFound.dataValues.full_name,
        surname: UserFound.dataValues.sur_name,
        email: UserFound.dataValues.email,
        CreatedAt: UserFound.dataValues.CreatedAt
    })


}


export const verify = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json(['No autorizado'])


    // jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    //     if (err) return res.status(401).json(['No autorizado'])

    //     const userFound = await User.findByPk(user.id)
    //     if (!userFound) return res.status(401).json(['No autorizado'])


    //     return res.json({
    //         id: userFound.dataValues.id,
    //         full_name: userFound.dataValues.full_name,
    //         surname: userFound.dataValues.full_name,
    //         email: userFound.dataValues.email,
    //         roleId: userFound.dataValues.roleId,
    //         CreatedAt: userFound.dataValues.CreatedAt
    //     })
    // })
    jwt.verify(token, "some secret key", async (err, user) => {
        if (err) return res.status(401).json(['No autorizado'])

        const userFound = await User.findByPk(user.id)
        if (!userFound) return res.status(401).json(['No autorizado'])


        return res.json({
            id: userFound.dataValues.id,
            full_name: userFound.dataValues.full_name,
            surname: userFound.dataValues.full_name,
            email: userFound.dataValues.email,
            roleId: userFound.dataValues.roleId,
            CreatedAt: userFound.dataValues.CreatedAt
        })
    })

}