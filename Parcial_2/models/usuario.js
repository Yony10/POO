const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    id: String,
    nombre: String,
    credito: { type: Number, default: 0 }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
