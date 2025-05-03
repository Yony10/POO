const Usuario = require('../models/usuario');
const Envio = require('../models/envio');
const Producto = require('../models/producto');

let usuarios = [];
let envios = [];

function comprarCredito(id, nombre, monto) {
    const creditosMap = { 135: 30, 160: 40, 180: 60 };
    const creditos = creditosMap[monto];
    if (!creditos) return { error: 'Monto inválido' };

    let usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        usuario = new Usuario(id, nombre);
        usuarios.push(usuario);
    }
    usuario.agregarCredito(creditos);
    return { mensaje: 'Crédito agregado', creditos: usuario.credito };
}

function getUsuario(id) {
    return usuarios.find(u => u.id === id);
}

function registrarEnvio(data) {
    const usuario = getUsuario(data.usuarioId);
    if (!usuario) return { error: "Usuario no encontrado" };
    if (!usuario.usarCredito()) return { error: "Crédito insuficiente" };

    const nuevoEnvio = new Envio(
        Date.now().toString(),
        data.usuarioId,
        data.nombre,
        data.direccion,
        data.telefono,
        data.referencia,
        data.observacion
    );

    envios.push(nuevoEnvio);
    return nuevoEnvio;
}

function agregarProductoAEnvio(envioId, data) {
    const envio = envios.find(e => e.id === envioId);
    if (!envio) return { error: "Envío no encontrado" };

    const producto = new Producto(
        data.descripcion,
        data.peso,
        data.bultos,
        data.fecha_entrega
    );

    envio.agregarProducto(producto);
    const costo = envio.calcularCosto();
    return { mensaje: "Producto agregado", costo };
}

function obtenerEnviosPorUsuario(usuarioId) {
    return envios.filter(e => e.usuarioId === usuarioId);
}

function eliminarEnvio(envioId) {
    const index = envios.findIndex(e => e.id === envioId);
    if (index === -1) return { error: "Envío no encontrado" };

    const envio = envios[index];
    const usuario = getUsuario(envio.usuarioId);
    if (usuario) usuario.devolverCredito();

    envios.splice(index, 1);
    return { mensaje: "Envío eliminado y crédito devuelto" };
}

module.exports = {
    comprarCredito,
    getUsuario,
    registrarEnvio,
    agregarProductoAEnvio,
    obtenerEnviosPorUsuario,
    eliminarEnvio
};
