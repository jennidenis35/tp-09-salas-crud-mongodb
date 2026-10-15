const dns = require("node:dns");
const mongoose = require("mongoose");

const { obtenerMongoUri } = require("./entorno");

// Resolutores DNS utilizados en la práctica.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Conectar con MongoDB Atlas.
async function conectarBaseDatos() {
  const uri = obtenerMongoUri();

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

// Cerrar la conexión.
async function desconectarBaseDatos() {
  await mongoose.disconnect();
}

// Mostrar información del error sin revelar credenciales.
function describirErrorConexion(error) {
  const informacion = [`Tipo de error: ${error.name || "Desconocido"}`];

  if (error.code) {
    informacion.push(`Código: ${error.code}`);
  }

  if (error.syscall) {
    informacion.push(`Operación: ${error.syscall}`);
  }

  if (error.cause?.code) {
    informacion.push(`Código DNS: ${error.cause.code}`);
  }

  if (error.cause?.syscall) {
    informacion.push(`Operación DNS: ${error.cause.syscall}`);
  }

  return informacion.join("\n");
}

module.exports = {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirErrorConexion,
};
