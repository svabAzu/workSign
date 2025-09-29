import express from 'express';

import db  from './config/db';
import { corsMiddleware } from './middlewares/cors.middleware';
import cookieParser from 'cookie-parser';



import  routerAuth  from "./router/auth.router";
import routerUser from './router/users.router';
import routerSpecialty from './router/specialty.router';
import routerTypeUser from './router/typeUser.router';

import routerTask from './router/task.router';

import routerJob from './router/job.router';
import routerTypeJob from './router/typeJob.router';
import routerClient from './router/client.router';
import routerGeneralTask from './router/generalTask.router';
import routerGeneralTaskStates from './router/generalTaskStates.router';
import routerMaterial from './router/materials.router';
import routerOperatorsStates from './router/taskOperatorsStates.router';


const server=express();
server.use(express.json());
server.use(cookieParser());

async function conectDB(){
    try {
        await db.authenticate()
        await db.sync()
        console.log('La base de datos se conecto correctamente')
    } catch (error) {
        console.log(error)
        console.log('error de conexion en la bd')
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

// Middleware para manejar CORS
server.use(corsMiddleware);


server.use('/uploads', express.static('uploads'));



server.use('/api/',routerAuth)
server.use('/api/user',routerUser);
server.use('/api/specialty',routerSpecialty);
server.use('/api/typeUser',routerTypeUser);

server.use('/api/task', routerTask);

server.use('/api/job', routerJob);
server.use('/api/typeJob', routerTypeJob);
server.use('/api/client', routerClient);
server.use('/api/generalTask', routerGeneralTask);
server.use('/api/GeneraltaskStates', routerGeneralTaskStates);
server.use('/api/materials', routerMaterial);
server.use('/api/taskOperatorsState', routerOperatorsStates);





export default server;