const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    descripcion: String,
    peso: Number,
    bultos: Number,
    fecha_entrega: String
});

module.exports = productoSchema;
