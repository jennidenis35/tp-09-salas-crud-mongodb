const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

// Identifica el área de reservas.
function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

// Valida los datos antes de registrar una reserva.
function validarReserva(req, res, next) {
  const estudiante = String(req.body.estudiante || "").trim();
  const email = String(req.body.email || "").trim();
  const sala = String(req.body.sala || "").trim();
  const fecha = String(req.body.fecha || "").trim();
  const turno = String(req.body.turno || "").trim();
  const personas = Number(req.body.personas);

  // Conserva los valores ingresados.
  const datos = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: req.body.personas,
  };

  let error = null;

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    req.body.personas === undefined ||
    req.body.personas === ""
  ) {
    error = "Todos los campos son obligatorios.";
  } else if (!email.includes("@")) {
    error = "Ingresá un email válido.";
  } else if (!salasPermitidas.includes(sala)) {
    error = "La sala seleccionada no está permitida.";
  } else if (!turnosPermitidos.includes(turno)) {
    error = "El turno seleccionado no está permitido.";
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    error = "La cantidad de personas debe ser un entero entre 1 y 6.";
  }

  // Si hay errores, responde 400 y detiene el proceso.
  if (error) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error,
      datos,
      salasPermitidas,
      turnosPermitidos,
    });
  }

  // Si es válida, prepara los datos para el controlador.
  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  salasPermitidas,
  turnosPermitidos,
};
