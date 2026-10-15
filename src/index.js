const { obtenerConfiguracion } = require("./config/entorno");
const crearServicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const crearApp = require("./app");

// Datos iniciales de las reservas.
const datosIniciales = [
  {
    id: 1,
    estudiante: "Ana Pérez",
    email: "ana@email.com",
    sala: "Sala Norte",
    fecha: "2026-09-22",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Lucas Gómez",
    email: "lucas@email.com",
    sala: "Sala Sur",
    fecha: "2026-09-23",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Carla Díaz",
    email: "carla@email.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-24",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Martín López",
    email: "martin@email.com",
    sala: "Sala Norte",
    fecha: "2026-09-25",
    turno: "Tarde",
    personas: 5,
  },
];

try {
  // Leer y validar la configuración.
  const configuracion = obtenerConfiguracion();

  // Crear una única instancia del servicio.
  const servicio = crearServicioReservas(datosIniciales);

  // Crear el controlador utilizando ese servicio.
  const controlador = crearControladorReservas(servicio);

  // Construir la aplicación Express.
  const app = crearApp(controlador, configuracion);

  // Iniciar el servidor.
  app.listen(configuracion.puerto, () => {
    console.log(
      `Servidor iniciado en http://localhost:${configuracion.puerto}`,
    );

    console.log(`Entorno: ${configuracion.entorno}`);
  });
} catch (error) {
  console.error(`Error de configuración: ${error.message}`);
  process.exitCode = 1;
}
