class Envio {
    constructor(id, usuarioId, nombre, direccion, telefono, referencia, observacion) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.referencia = referencia;
        this.observacion = observacion;
        this.producto = null;
    }

    agregarProducto(producto) {
        this.producto = producto;
    }

    calcularCosto() {
        if (!this.producto) return 0;
        const peso = this.producto.peso;
        if (peso <= 3) return 1;
        if (peso <= 6) return 2;
        return 3;
    }
}

module.exports = Envio;
