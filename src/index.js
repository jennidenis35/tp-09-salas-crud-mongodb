const { obtenerConfiguracion } = require("./config/entorno");

const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirErrorConexion,
} = require("./config/base-datos");

const crearServicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const crearControladorApiReservas = require("./controladores/api-reservas");
const crearApp = require("./app");

async function iniciarServidor() {
  let etapa = "lectura de configuración";

  try {
    // 1. Leer y validar la configuración.
    const configuracion = obtenerConfiguracion();

    // 2. Conectar con MongoDB Atlas.
    etapa = "conexión con MongoDB Atlas";
    await conectarBaseDatos();

    console.log("Conexión con MongoDB Atlas establecida.");

    // 3. Crear el servicio de reservas.
    etapa = "creación del servicio de reservas";
    const servicio = crearServicioReservas();

    // 4. Crear los controladores.
    etapa = "creación de los controladores";
    const controlador = crearControladorReservas(servicio);
    const controladorApi = crearControladorApiReservas(servicio);

    // 5. Construir la aplicación Express.
    etapa = "configuración de la aplicación Express";
    const app = crearApp(controlador, controladorApi, configuracion);

    // 6. Iniciar el servidor HTTP.
    etapa = "inicio del servidor HTTP";

    const servidor = app.listen(configuracion.puerto, () => {
      console.log(
        `Servidor iniciado en http://localhost:${configuracion.puerto}`,
      );

      console.log(`Entorno: ${configuracion.entorno}`);
    });

    // Cierre ordenado del servidor y de MongoDB.
    let cerrando = false;

    async function cerrarServidor() {
      if (cerrando) return;

      cerrando = true;
      console.log("\nCerrando servidor...");

      servidor.close(async () => {
        try {
          await desconectarBaseDatos();
          console.log("Conexión con MongoDB cerrada.");
          process.exit(0);
        } catch (error) {
          console.error("Error al cerrar MongoDB:");
          console.error(describirErrorConexion(error));
          process.exit(1);
        }
      });
    }

    process.on("SIGINT", cerrarServidor);
    process.on("SIGTERM", cerrarServidor);
  } catch (error) {
    console.error("\nNo se pudo iniciar el servidor.");
    console.error(`Etapa del error: ${etapa}`);
    console.error(`Tipo de error: ${error.name}`);
    console.error(`Detalle: ${error.message}`);

    await desconectarBaseDatos().catch(() => {});

    process.exitCode = 1;
  }
}

iniciarServidor();
