# 📦 API de Gestión de Envíos y Créditos

Esta API permite registrar usuarios, comprar créditos, registrar envíos, agregar productos y controlar costos según el peso. Ideal para una empresa de mensajería o sistema de logística.

## 🌐 Base URL

http://localhost:3000

## 🧰 Requisitos

- Node.js
- MongoDB Atlas

### Instalación

```bash
npm install
Iniciar el servidor

node app.js
💳 Comprar crédito
Agrega crédito a un usuario (si no existe, lo crea).
Montos válidos:

135 → 30 créditos

160 → 40 créditos

180 → 60 créditos

POST
http://localhost:3000/comprar

Ejemplo JSON:

{
  "id": "002",
  "nombre": "Alex Salazar",
  "monto": 160
}
📈 Ver crédito de un usuario
Consulta cuántos créditos tiene disponibles.

GET
http://localhost:3000/usuario/002/creditos

📬 Crear un nuevo envío
Crea un envío y descuenta 1 crédito automáticamente.

POST
http://localhost:3000/envios

Ejemplo JSON:

{
  "id": "002",
  "nombre": "Alex Salazar",
  "direccion": "Calle antigua a San Salvador 123",
  "telefono": "555-1234",
  "referencia": "Casa roja",
  "observacion": "Producto Fragil"
}
📦 Agregar producto a un envío
Agrega información del producto y descuenta créditos según el peso:

1 crédito por cada 3 lb (redondeado hacia arriba)

Ejemplo: 7.5 lb = 3 créditos

POST
http://localhost:3000/envios/681791e725a6b03c208b106f/producto

Ejemplo JSON:

{
  "descripcion": "Consola de Juegos",
  "peso": 7.5,
  "bultos": 2,
  "fecha_entrega": "2025-05-10"
}
📚 Obtener todos los envíos de un usuario
Muestra todos los envíos realizados por un usuario.

GET
http://localhost:3000/envios/002

❌ Eliminar un envío
Elimina un envío y devuelve 1 crédito al usuario.

DELETE
http://localhost:3000/envios/681791e725a6b03c208b106f

👁️ Ver todos los envíos (modo admin)
Muestra todos los envíos sin filtro por usuario.

GET
http://localhost:3000/envios

📄 Modelo de Envíos

{
  "usuario": {
    "id": "String",
    "nombre": "String",
    "credito": 0
  },
  "direccion": "String",
  "telefono": "String",
  "referencia": "String",
  "observacion": "String",
  "producto": {
    "descripcion": "String",
    "peso": 0,
    "bultos": 0,
    "fecha_entrega": "Date"
  }
}
