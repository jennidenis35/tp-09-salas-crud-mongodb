const Reserva = require("../src/modelos/reserva");

const datosCorrectos = {
  estudiante: "María López",
  email: "maria@example.com",
  sala: "Sala Norte",
  fecha: "2026-10-22",
  turno: "Mañana",
  personas: 2,
};

const pruebas = [
  {
    nombre: "Estudiante vacío",
    cambios: { estudiante: "" },
  },
  {
    nombre: "Email inválido",
    cambios: { email: "correo-invalido" },
  },
  {
    nombre: "Sala no permitida",
    cambios: { sala: "Sala Central" },
  },
  {
    nombre: "Turno no permitido",
    cambios: { turno: "Madrugada" },
  },
  {
    nombre: "Cero personas",
    cambios: { personas: 0 },
  },
  {
    nombre: "Más de seis personas",
    cambios: { personas: 7 },
  },
  {
    nombre: "Personas con decimales",
    cambios: { personas: 2.5 },
  },
];

async function probarValidaciones() {
  for (const prueba of pruebas) {
    const reserva = new Reserva({
      ...datosCorrectos,
      ...prueba.cambios,
    });

    try {
      await reserva.validate();

      console.log(`ERROR: ${prueba.nombre} fue aceptada.`);
      process.exitCode = 1;
    } catch (error) {
      if (error.name === "ValidationError") {
        console.log(`CORRECTO: ${prueba.nombre} fue rechazada.`);
      } else {
        console.error(`Error inesperado: ${error.name}`);
        process.exitCode = 1;
      }
    }
  }

  console.log("Pruebas terminadas sin guardar documentos.");
}

probarValidaciones();
