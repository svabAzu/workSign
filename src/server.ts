import express from 'express';

import db  from './config/db';

const server=express();
server.use(express.json());

async function conectDB(){
    try {
        await db.authenticate()
        db.sync()
        console.log('La base de datos se conecto correctamente')
    } catch (error) {
        console.log(error)
        console.log('eeror de conexion en la bd')
    }
}
conectDB();


export default server;