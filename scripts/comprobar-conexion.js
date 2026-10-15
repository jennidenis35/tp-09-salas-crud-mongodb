const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirErrorConexion,
} = require("../src/config/base-datos");

async function comprobarConexion() {
  try {
    console.log("Comprobando conexión con MongoDB Atlas...");

    const conexion = await conectarBaseDatos();

    console.log("Conexión establecida correctamente.");
    console.log(`Base de datos: ${conexion.name}`);
    console.log("Prueba finalizada sin crear reservas.");
  } catch (error) {
    console.error("No se pudo conectar a MongoDB Atlas.");
    console.error(describirErrorConexion(error));

    process.exitCode = 1;
  } finally {
    try {
      await desconectarBaseDatos();
      console.log("Conexión cerrada.");
    } catch (error) {
      console.error("No se pudo cerrar la conexión.");
      console.error(describirErrorConexion(error));

      process.exitCode = 1;
    }
  }
}

comprobarConexion();
