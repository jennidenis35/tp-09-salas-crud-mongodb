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

  // Reemplazar todos los campos editables de una reserva.
  async function reemplazar(id, datosReserva) {
    return await Reserva.findOneAndReplace({ _id: id }, datosReserva, {
      returnDocument: "after",
      runValidators: true,
      upsert: false,
    }).lean();
  }

  // Modificar parcialmente una reserva.
  async function actualizarParcial(id, cambios) {
    return await Reserva.findByIdAndUpdate(
      id,
      { $set: cambios },
      {
        returnDocument: "after",
        runValidators: true,
        upsert: false,
      },
    ).lean();
  }

  // Eliminar físicamente una reserva.
  async function eliminar(id) {
    return await Reserva.findByIdAndDelete(id).lean();
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
  };
}

module.exports = crearServicioReservas;
