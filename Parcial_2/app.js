const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const DB = require('./servicios/dataBase');

app.use(express.json());

app.post('/comprar', (req, res) => {
    const { id, nombre, monto } = req.body;
    const resultado = DB.comprarCredito(id, nombre, monto);
    res.json(resultado);
});

app.get('/usuario/:id/creditos', (req, res) => {
    const usuario = DB.getUsuario(req.params.id);
    if (usuario) res.json({ credito: usuario.credito });
    else res.status(404).json({ error: "Usuario no encontrado" });
});

app.post('/envios', (req, res) => {
    const resultado = DB.registrarEnvio(req.body);
    res.json(resultado);
});

app.post('/envios/:id/producto', (req, res) => {
    const resultado = DB.agregarProductoAEnvio(req.params.id, req.body);
    res.json(resultado);
});

app.get('/envios/:usuarioId', (req, res) => {
    const envios = DB.obtenerEnviosPorUsuario(req.params.usuarioId);
    res.json(envios);
});

app.delete('/envios/:id', (req, res) => {
    const resultado = DB.eliminarEnvio(req.params.id);
    res.json(resultado);
});

app.listen(process.env.PUERTO, () => {
    console.log(`Servidor corriendo`);
});