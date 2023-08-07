import winston from "winston";

// Definir los niveles de prioridad para el logger
const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
};

// Definir los colores para los diferentes niveles
const logColors = {
    debug: "cyan",
    http: "green",
    info: "blue",
    warning: "yellow",
    error: "red",
    fatal: "magenta",
};

// Configuración del logger para desarrollo
const developmentLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

// Configuración del logger para producción
const productionLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: "errors.log",
            level: "error",
        }),
    ],
});

// Establecer el nivel de logging para cada logger
developmentLogger.level = "debug";
productionLogger.level = "info";

// Función para obtener el logger adecuado según el entorno
const getLogger = () => {
    if (process.env.NODE_ENV === "production") {
        return productionLogger;
    } else {
        return developmentLogger;
    }
};

export default getLogger;
