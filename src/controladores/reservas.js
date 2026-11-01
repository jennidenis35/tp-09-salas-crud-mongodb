const { salasPermitidas, turnosPermitidos } = require("../middleware/reservas");

function crearControladorReservas(servicio) {
  function mostrarInicio(req, res) {
    res.status(200).render("inicio", {
      titulo: "Inicio",
    });
  }

  async function mostrarEstado(req, res, next) {
    try {
      const cantidad = await servicio.contar();

      res.status(200).json({
        servicio: "activo",
        reservas: cantidad,
        solicitudId: res.locals.solicitudId,
      });
    } catch (error) {
      next(error);
    }
  }

  async function listarReservas(req, res, next) {
    try {
      const reservas = await servicio.listar();

      res.status(200).render("reservas/lista", {
        titulo: "Reservas de salas",
        reservas,
      });
    } catch (error) {
      next(error);
    }
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

  async function mostrarDetalle(req, res, next) {
    try {
      const reserva = await servicio.buscarPorId(req.params.id);

      if (!reserva) {
        return res.status(404).render("no-encontrado", {
          titulo: "Reserva no encontrada",
          mensaje: "La reserva solicitada no existe.",
        });
      }

      res.status(200).render("reservas/detalle", {
        titulo: `Reserva ${reserva._id}`,
        reserva,
      });
    } catch (error) {
      next(error);
    }
  }

  async function crearReserva(req, res, next) {
    try {
      await servicio.crear(req.reservaValidada);

      res.redirect(302, "/reservas");
    } catch (error) {
      next(error);
    }
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
