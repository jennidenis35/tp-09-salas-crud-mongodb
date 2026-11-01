const express = require("express");

function crearRouterApiReservas(controlador) {
  const router = express.Router();

  // GET /api/reservas
  // GET /api/reservas?sala=Sala%20Norte
  router.get("/", controlador.listar);

  // GET /api/reservas/:id
  router.get("/:id", controlador.buscarPorId);

  // POST /api/reservas
  router.post("/", controlador.crear);

  return router;
}

module.exports = crearRouterApiReservas;
