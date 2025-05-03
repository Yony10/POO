const mongoose = require('mongoose');
const productoSchema = require('./producto');

const envioSchema = new mongoose.Schema({
    usuarioId: String,
    nombre: String,
    direccion: String,
    telefono: String,
    referencia: String,
    observacion: String,
    producto: productoSchema
});

module.exports = mongoose.model('Envio', envioSchema);
