const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
    usuario: {
        id: String,
        nombre: String,
        credito: Number,
    },
    direccion: String,
    telefono: String,
    referencia: String,
    observacion: String,
    producto: {
        descripcion: String,
        peso: Number,
        bultos: Number,
        fecha_entrega: Date
    }
});

module.exports = mongoose.model('Envio', envioSchema);
