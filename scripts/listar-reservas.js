const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirErrorConexion,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function listarReservas() {
  try {
    console.log("Conectando con MongoDB Atlas...");

    await conectarBaseDatos();

    const reservas = await Reserva.find();

    console.log("\nLISTADO DE RESERVAS");
    console.log("============================");

    if (reservas.length === 0) {
      console.log("No hay reservas registradas.");
    } else {
      reservas.forEach((reserva, indice) => {
        console.log(`\nReserva ${indice + 1}`);
        console.log(`ID: ${reserva._id.toString()}`);
        console.log(`Estudiante: ${reserva.estudiante}`);
        console.log(`Email: ${reserva.email}`);
        console.log(`Sala: ${reserva.sala}`);
        console.log(`Fecha: ${reserva.fecha}`);
        console.log(`Turno: ${reserva.turno}`);
        console.log(`Personas: ${reserva.personas}`);
      });
    }

    console.log("\n============================");
    console.log(`Cantidad de reservas: ${reservas.length}`);
  } catch (error) {
    console.error("No se pudieron consultar las reservas.");
    console.error(describirErrorConexion(error));
    process.exitCode = 1;
  } finally {
    try {
      await desconectarBaseDatos();
      console.log("Conexión cerrada.");
    } catch (error) {
      console.error("Error al cerrar la conexión.");
      console.error(describirErrorConexion(error));
      process.exitCode = 1;
    }
  }
}

listarReservas();
