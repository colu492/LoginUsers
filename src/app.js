import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
//import FileStore from "session-file-store";
import session from 'express-session';
import MongoStore from "connect-mongo";
//import githubStrategy from './github.strategy.js';
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import run from "./run.js";
import __dirname from "./utils.js";
import dotenv from 'dotenv';
import { createLogger, transports, format } from 'winston'; // Importamos el módulo winston

dotenv.config()

import mockingProductsRouter from './mocks/mockingProducts.js';

const app = express();

// Ruta para el endpoint /loggerTest
app.get("/loggerTest", (req, res) => {
    const logger = getLogger(); // Obtener el logger adecuado según el entorno

    // Registrar diferentes tipos de logs para probar el funcionamiento
    logger.debug("This is a debug log.");
    logger.http("This is an HTTP log.");
    logger.info("This is an info log.");
    logger.warning("This is a warning log.");
    logger.error("This is an error log.");
    logger.fatal("This is a fatal log.");

    // Enviar una respuesta al cliente
    res.json({ message: "Logs have been generated successfully." });
});

// Configuración del logger
const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Nivel según el entorno
    transports: [
        new transports.Console(), // Log en consola para desarrollo
        new transports.File({ filename: 'errors.log', level: 'error' }) // Log en archivo 'errors.log' para errores
    ],
    format: format.combine(
        format.colorize(), // Colorear el log en consola
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Agregar timestamp
        format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`) // Formato del log
    )
});

// mongoose.set("strictQuery", false);

// const GITHUB_CLIENT_ID = 'Iv1.4bff6704cbebaf8c';
// const GITHUB_CLIENT_SECRET = 'b9bc9dc05970afe66da12becbd024ab3e70de5b5';
// const GITHUB_CALLBACK_URL = 'http://localhost:8080/session/github/callback';

// githubStrategy(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use(cookieParser())

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/mockingproducts', mockingProductsRouter);

// const MONGO_URI = "mongodb+srv://colu492:colu159159@cluster0.fiqaj09.mongodb.net/"
// const MONGO_DB_NAME = "integradora2"

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: MONGO_URI,
    //     dbName: MONGO_DB_NAME,
    // }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
//app.get('/session/github', passport.authenticate('github'));
// app.use('/session', sessionRouter);

// app.use(session({
    //     store: MongoStore.create({
        //         mongoUrl: ,
        //         dbName:
        //     }),
        //     secret: 'mysecret',
        //     resave: true,
        //     saveUninitialzed: true
        
        // }))
        

        mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            })
                .then(() => {
                const httpServer = app.listen(8080, () => console.log("Escuchando..."));
                const socketServer = new Server(httpServer);
                httpServer.on("error", (e) => console.log("Error: " + e));
            
                run(socketServer, app);
                })
                .catch((error) => {
                console.log("Error al conectar a la base de datos:", error);
                });