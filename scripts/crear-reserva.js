const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirErrorConexion,
} = require("../src/config/base-datos");

const Reserva = require("../src/modelos/reserva");

async function crearReserva() {
  try {
    console.log("Conectando con MongoDB Atlas...");

    await conectarBaseDatos();

    const datosReserva = {
      estudiante: "Lucía Fernández",
      email: "lucia@example.com",
      sala: "Sala Norte",
      fecha: "2026-10-20",
      turno: "Mañana",
      personas: 2,
    };

    const nuevaReserva = new Reserva(datosReserva);

    const reservaGuardada = await nuevaReserva.save();

    console.log("Reserva guardada correctamente.");
    console.log(`ID: ${reservaGuardada._id.toString()}`);
    console.log(`Estudiante: ${reservaGuardada.estudiante}`);
    console.log(`Sala: ${reservaGuardada.sala}`);
    console.log(`Fecha: ${reservaGuardada.fecha}`);
    console.log(`Turno: ${reservaGuardada.turno}`);
    console.log(`Personas: ${reservaGuardada.personas}`);
  } catch (error) {
    console.error("No se pudo guardar la reserva.");
    console.error(`Tipo de error: ${error.name || "Desconocido"}`);

    if (error.name === "ValidationError") {
      for (const [campo, detalle] of Object.entries(error.errors)) {
        console.error(`Campo ${campo}: ${detalle.message}`);
      }
    } else {
      console.error(describirErrorConexion(error));
    }

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

crearReserva();
