import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    persistence: process.env.PERSISTENCE_TYPE || "MONGO", // Default: "MONGO" si no se proporciona en las variables de entorno
  },
};

export default config;
