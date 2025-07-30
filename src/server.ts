import express from 'express';

import db  from './config/db';



import  routerUser  from "./router/auth.router";
import routerClient from './router/client';
import routerTask from './router/generalTask';
import routerTaskStates from './router/generalTaskStates';

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

// async function connectDB() {
//    try {
//        await db.authenticate(); // Verificar conexión con la base de datos
//        console.log("Conexión a la base de datos exitosa");
  
//        await db.sync({ force: true }); // Sincronizar tablas (¡Cuidado con force en producción!)
//        console.log("Tablas sincronizadas");
//      } catch (error) {
//        console.error("Error al conectar o sincronizar la base de datos:", error);
//      }
//    }
//   connectDB()

server.use('/api/',routerUser);
server.use('/api/client', routerClient);
server.use('/api/task', routerTask);
server.use('/api/taskStates', routerTaskStates);


export default server;