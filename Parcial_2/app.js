const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

require('./servicios/dataBase'); // conexión MongoDB

const Envio = require('./models/envio');

const app = express();
app.use(express.json());

/**
 * Comprar crédito (modifica los datos en el primer envío o crea uno nuevo)
 */
app.post('/comprar', async (req, res) => {
    const { id, nombre, monto } = req.body;
    const creditosMap = { 135: 30, 160: 40, 180: 60 };
    const creditos = creditosMap[monto];
    if (!creditos) return res.status(400).json({ error: 'Monto inválido' });

    let envio = await Envio.findOne({ 'usuario.id': id });

    if (!envio) {
        envio = new Envio({
            usuario: { id, nombre, credito: creditos }
        });
    } else {
        envio.usuario.credito += creditos;
    }

    await envio.save();
    res.json({ mensaje: 'Crédito agregado', creditos: envio.usuario.credito });
});

/**
 * Ver crédito de usuario
 */
app.get('/usuario/:id/creditos', async (req, res) => {
    const envio = await Envio.findOne({ 'usuario.id': req.params.id });
    if (!envio) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ creditos: envio.usuario.credito });
});

/**
 * Crear nuevo envío (descuenta 1 crédito)
 */
app.post('/envios', async (req, res) => {
    const { id, nombre, direccion, telefono, referencia, observacion } = req.body;

    const envioBase = await Envio.findOne({ 'usuario.id': id });
    if (!envioBase) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (envioBase.usuario.credito <= 0) {
        return res.status(400).json({ error: 'Crédito insuficiente' });
    }

    envioBase.usuario.credito -= 1;
    await envioBase.save();

    const nuevoEnvio = new Envio({
        usuario: envioBase.usuario,
        direccion,
        telefono,
        referencia,
        observacion
    });

    await nuevoEnvio.save();
    res.json(nuevoEnvio);
});
/**
 * Agregar información de producto a un envío y descontar crédito según el peso
 */
app.post('/envios/:id/producto', async (req, res) => {
    try {
        const envio = await Envio.findById(req.params.id);
        if (!envio) return res.status(404).json({ error: 'Envío no encontrado' });

        const { descripcion, peso, bultos, fecha_entrega } = req.body;

        if (!peso || typeof peso !== 'number' || peso <= 0) {
            return res.status(400).json({ error: 'Peso inválido' });
        }

        // Calcular costo: se cobra 1 crédito por cada 3lb (redondeado hacia arriba)
        const costo = Math.ceil(peso / 3);

        // Buscar el usuario base
        const usuarioId = envio.usuario.id;
        const envioBase = await Envio.findOne({ 'usuario.id': usuarioId });

        if (!envioBase || envioBase.usuario.credito < costo) {
            return res.status(400).json({ error: 'Crédito insuficiente para este envío' });
        }

        // Descontar el crédito
        envioBase.usuario.credito -= costo;
        await envioBase.save();

        // Asignar la información del producto al envío
        envio.producto = { descripcion, peso, bultos, fecha_entrega };
        await envio.save();

        res.json({
            mensaje: 'Producto agregado y crédito descontado',
            costo,
            creditoRestante: envioBase.usuario.credito
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



/**
 * Obtener todos los envíos de un usuario
 */
app.get('/envios/:usuarioId', async (req, res) => {
    const envios = await Envio.find({ 'usuario.id': req.params.usuarioId });
    res.json(envios);
});

/**
 * Eliminar un envío (y devolver 1 crédito)
 */
app.delete('/envios/:id', async (req, res) => {
    const envio = await Envio.findById(req.params.id);
    if (!envio) return res.status(404).json({ error: 'Envío no encontrado' });

    const usuarioId = envio.usuario.id;
    const baseEnvio = await Envio.findOne({ 'usuario.id': usuarioId });
    if (baseEnvio) {
        baseEnvio.usuario.credito += 1;
        await baseEnvio.save();
    }

    await Envio.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Envío eliminado y crédito devuelto' });
});


// Ver todos los envíos sin filtro
app.get('/envios', async (req, res) => {
    const envios = await Envio.find();
    res.json(envios);
});

// Ver envíos de un usuario específico
app.get('/envios/:usuarioId', async (req, res) => {
    const envios = await Envio.find({ 'usuario.id': req.params.usuarioId });
    res.json(envios);
});


const PORT = process.env.PUERTO || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

