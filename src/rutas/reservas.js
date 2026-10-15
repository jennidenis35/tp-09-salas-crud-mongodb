const express = require("express");

const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

function crearRouterReservas(controlador) {
  const router = express.Router();

  // Middleware exclusivo del área de reservas.
  router.use(prepararAreaReservas);

  // GET /reservas
  router.get("/", controlador.listarReservas);

  // GET /reservas/nueva
  router.get("/nueva", controlador.mostrarFormulario);

  // GET /reservas/:id
  router.get("/:id", controlador.mostrarDetalle);

  // POST /reservas
  router.post("/", validarReserva, controlador.crearReserva);

  return router;
}

module.exports = crearRouterReservas;
