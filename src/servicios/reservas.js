const Reserva = require("../modelos/reserva");

// Servicio encargado de trabajar con las reservas en MongoDB.
function crearServicioReservas() {
  // Obtener todas las reservas.
  async function listar(filtros = {}) {
    return await Reserva.find(filtros).sort({ _id: 1 }).lean();
  }

  // Buscar una reserva por su identificador de MongoDB.
  async function buscarPorId(id) {
    return await Reserva.findById(id).lean();
  }

  // Contar la cantidad total de reservas.
  async function contar() {
    return await Reserva.countDocuments();
  }

  // Crear y guardar una nueva reserva.
  async function crear(datosReserva) {
    const nuevaReserva = await Reserva.create(datosReserva);

    return nuevaReserva.toObject();
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = crearServicioReservas;
