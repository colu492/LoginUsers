// tests/setup.js
const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a la base de datos de prueba
before(async () => {
    const testMongoUri = process.env.TEST_MONGO_URI;
    await mongoose.connect(testMongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Desconectar de la base de datos después de los tests
after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
