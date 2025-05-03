const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// Conexión a la base de datos (usa la clase singleton)
require('./servicios/dataBase');

const Usuario = require('./models/usuario');
const Envio = require('./models/envio');

const app = express();
app.use(express.json());

/**
 * Comprar crédito para un usuario
 */
app.post('/comprar', async (req, res) => {
    const { id, nombre, monto } = req.body;
    const creditosMap = { 135: 30, 160: 40, 180: 60 };
    const creditos = creditosMap[monto];
    if (!creditos) return res.status(400).json({ error: 'Monto inválido' });

    let usuario = await Usuario.findOne({ id });
    if (!usuario) {
        usuario = new Usuario({ id, nombre, credito: 0 });
    }

    usuario.credito += creditos;
    await usuario.save();

    res.json({ mensaje: 'Crédito agregado', creditos: usuario.credito });
});

/**
 * Obtener crédito disponible de un usuario
 */
app.get('/usuario/:id/creditos', async (req, res) => {
    const usuario = await Usuario.findOne({ id: req.params.id });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ creditos: usuario.credito });
});

/**
 * Registrar un envío nuevo (descuenta 1 crédito)
 */
app.post('/envios', async (req, res) => {
    const data = req.body;

    const usuario = await Usuario.findOne({ id: data.usuarioId });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (usuario.credito <= 0) return res.status(400).json({ error: 'Crédito insuficiente' });

    usuario.credito--;
    await usuario.save();

    const nuevoEnvio = new Envio({
        usuarioId: data.usuarioId,
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        referencia: data.referencia,
        observacion: data.observacion
    });

    await nuevoEnvio.save();
    res.json(nuevoEnvio);
});

/**
 * Agregar un producto a un envío
 */
app.post('/envios/:id/producto', async (req, res) => {
    const envio = await Envio.findById(req.params.id);
    if (!envio) return res.status(404).json({ error: 'Envío no encontrado' });

    envio.producto = req.body;
    await envio.save();

    const peso = envio.producto.peso;
    let costo = 0;
    if (peso <= 3) costo = 1;
    else if (peso <= 6) costo = 2;
    else costo = 3;

    res.json({ mensaje: 'Producto agregado', costo });
});

/**
 * Ver todos los envíos de un usuario
 */
app.get('/envios/:usuarioId', async (req, res) => {
    const envios = await Envio.find({ usuarioId: req.params.usuarioId });
    res.json(envios);
});

/**
 * Eliminar un envío (y devolver crédito)
 */
app.delete('/envios/:id', async (req, res) => {
    const envio = await Envio.findById(req.params.id);
    if (!envio) return res.status(404).json({ error: 'Envío no encontrado' });

    const usuario = await Usuario.findOne({ id: envio.usuarioId });
    if (usuario) {
        usuario.credito++;
        await usuario.save();
    }

    await Envio.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Envío eliminado y crédito devuelto' });
});

// Puerto de escucha
const PORT = process.env.PUERTO || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
