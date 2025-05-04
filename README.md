# POO
# 📦 API de Gestión de Envíos y Créditos

Esta API permite registrar usuarios, comprar créditos, registrar envíos, agregar productos y controlar costos según el peso. Ideal para una empresa de mensajería o sistema de logística.


## Base URL
http://localhost:3000


## 🧰 Requisitos

- Node.js
- MongoDB Atlas
- Instalar dependencias con:

```bash
npm install
npm install mongoose dotenv

/////////////////////////////////////////////////////////////////////////
En la consola encender con --> node app.js

/////////////////////////////////////////////////////////////////////////
 Comprar crédito
Agrega crédito a un usuario (si no existe, lo crea).
En el thunder client Post --> http://localhost:3000/comprar
ejemplo
{
  "id": "002",
  "nombre": "Alex Salazar",
  "monto": 160
}
OJO:
Montos válidos: 135 (30 créditos), 160 (40 créditos), 180 (60 créditos).

/////////////////////////////////////////////////////////////////////////
 Ver crédito de un usuario
Consulta cuántos créditos tiene disponibles.

En el thunder client Get --> http://localhost:3000/usuario/002/creditos

/////////////////////////////////////////////////////////////////////////
Crear un nuevo envío
Crea un envío (descuenta 1 crédito).

En el thunder client Post --> http://localhost:3000/envios
ejemplo
{
  "id": "002",
  "nombre": "Alex Salazar",
  "direccion": "Calle antigua a San Salvador 123",
  "telefono": "555-1234",
  "referencia": "Casa roja",
  "observacion": "Producto Fragil"
}
Este paso descuenta 1 crédito automáticamente al usuario.

////////////////////////////////////////////////////////////////////////////
Agregar producto a un envío
Agrega información del producto al envío y descuenta créditos según el peso:

1 crédito por cada 3 lb (se redondea hacia arriba).

Ejemplo. 7.5 lb = 3 créditos.

En el thunder client Post --> http://localhost:3000/envios/"681791e725a6b03c208b106f/producto
{
  "descripcion": "Consola de Juegos",
  "peso": 7.5,
  "bultos": 2,
  "fecha_entrega": "2025-05-10"
}

//////////////////////////////////////////////////////////////////////////////////////
Obtener todos los envíos de un usuario
Muestra todos los envíos realizados por un usuario.

En el thunder client Get --> http://localhost:3000/envios/002

///////////////////////////////////////////////////////////////////////////
Eliminar un envío
Elimina un envío y devuelve 1 crédito al usuario.

En el thunder client Delete--> http://localhost:3000/envios/"681791e725a6b03c208b106f
Comentarios:El crédito se reembolsa automáticamente al eliminar el envío.

/////////////////////////////////////////////////////////
Ver todos los envíos (modo admin)
Muestra todos los envíos sin filtro por usuario.
En el thunder client Get--> http://localhost:3000/envios



Modelo de Envíos
{
  usuario: {
    id: String,
    nombre: String,
    credito: Number
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
}

