const { salasPermitidas, turnosPermitidos } = require("../middleware/reservas");
function crearControladorReservas(servicio) {
  function mostrarInicio(req, res) {
    res.status(200).render("inicio", {
      titulo: "Inicio",
    });
  }

  function mostrarEstado(req, res) {
    res.status(200).json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  }

  function listarReservas(req, res) {
    res.status(200).render("reservas/lista", {
      titulo: "Reservas de salas",
      reservas: servicio.listar(),
    });
  }
  function mostrarFormulario(req, res) {
    res.status(200).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      datos: {},
      salasPermitidas,
      turnosPermitidos,
    });
  }

  function mostrarDetalle(req, res) {
    const id = Number(req.params.id);

    const reserva = servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.status(200).render("reservas/detalle", {
      titulo: `Reserva ${reserva.id}`,
      reserva,
    });
  }

  function crearReserva(req, res) {
    servicio.crear(req.reservaValidada);

    res.redirect("/reservas");
  }

  return {
    mostrarInicio,
    mostrarEstado,
    listarReservas,
    mostrarFormulario,
    mostrarDetalle,
    crearReserva,
  };
}

module.exports = crearControladorReservas;
