require('dotenv').config();
console.log('🔍 URI:', process.env.MONGO_URI);

const mongoose = require('mongoose');

class DataBase {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log("Conexión exitosa a la base de datos"))
        .catch((err) => console.log("Fallo al conectar a la base de datos:", err));
    }

    static obtenerConexion() {
        if (!DataBase.instancia) {
            DataBase.instancia = new DataBase();
        }
        return DataBase.instancia;
    }
}

module.exports = DataBase.obtenerConexion();
