import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

export default class MongoClient {
  constructor() {
    this.connected = false;
    this.connectionString = process.env.MONGO_URI;
    this.dbName = process.env.MONGO_DB_NAME;
  }

  async connect() {
    try {
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: this.dbName,
      };
      await mongoose.connect(this.connectionString, connectionOptions);
      this.connected = true;
      console.log("Conexión exitosa con la base de datos MongoDB");
    } catch (error) {
      console.error("Error al conectar con la base de datos MongoDB:", error);
      throw new Error("Cannot connect to the database");
    }
  }
}
