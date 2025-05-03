class Usuario {
    constructor(id, nombre, credito = 0) {
        this.id = id;
        this.nombre = nombre;
        this.credito = credito;
    }

    agregarCredito(cantidad) {
        this.credito += cantidad;
    }

    usarCredito() {
        if (this.credito > 0) {
            this.credito--;
            return true;
        }
        return false;
    }

    devolverCredito() {
        this.credito++;
    }
}

module.exports = Usuario;
