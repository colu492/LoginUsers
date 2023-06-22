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
import __dirname from "./utils.js"

const app = express();

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

const MONGO_URI = "mongodb+srv://colu492:colu159159@cluster0.fiqaj09.mongodb.net/"
const MONGO_DB_NAME = "integradora2"

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
        

        mongoose.connect(MONGO_URI, {
            dbName: MONGO_DB_NAME,
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