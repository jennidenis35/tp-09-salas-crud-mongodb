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

  // PUT /api/reservas/:id
  router.put("/:id", controlador.reemplazar);

  // PATCH /api/reservas/:id
  router.patch("/:id", controlador.actualizarParcial);

  // DELETE /api/reservas/:id
  router.delete("/:id", controlador.eliminar);

  return router;
}

module.exports = crearRouterApiReservas;
