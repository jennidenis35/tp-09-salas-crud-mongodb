function crearControladorApiReservas(servicio) {
  // GET /api/reservas
  async function listar(req, res, next) {
    try {
      // Diagnóstico temporal para revisar la solicitud.
      console.log("URL recibida:", req.originalUrl);
      console.log("Parámetros recibidos:", req.query);

      const { sala } = req.query;

      // Solo se permite el filtro sala.
      if (Object.keys(req.query).some((clave) => clave !== "sala")) {
        return res.status(400).json({
          error: "Solo se permite el filtro sala.",
        });
      }

      // No se permiten parámetros sala repetidos.
      if (Array.isArray(sala)) {
        return res.status(400).json({
          error: "El parámetro sala no puede repetirse.",
        });
      }

      // Construir el filtro de forma segura.
      const filtros = {};

      if (sala !== undefined) {
        filtros.sala = sala;
      }

      const reservas = await servicio.listar(filtros);

      return res.status(200).json(reservas);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/reservas/:id
  async function buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar que sea un ObjectId hexadecimal de 24 caracteres.
      if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        return res.status(400).json({
          error: "El identificador de reserva no es válido.",
        });
      }

      const reserva = await servicio.buscarPorId(id);

      if (!reserva) {
        return res.status(404).json({
          error: "La reserva solicitada no existe.",
        });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/reservas
  async function crear(req, res, next) {
    try {
      // Verificar que el cuerpo sea un objeto JSON.
      if (
        !req.body ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          error: "El cuerpo de la solicitud debe ser un objeto JSON.",
        });
      }

      const { estudiante, email, sala, fecha, turno, personas } = req.body;

      // Solo aceptar los campos permitidos.
      const datos = {
        estudiante,
        email,
        sala,
        fecha,
        turno,
        personas,
      };

      const camposObligatorios = [
        "estudiante",
        "email",
        "sala",
        "fecha",
        "turno",
        "personas",
      ];

      const faltaCampo = camposObligatorios.some(
        (campo) =>
          datos[campo] === undefined ||
          datos[campo] === null ||
          datos[campo] === "",
      );

      if (faltaCampo) {
        return res.status(400).json({
          error: "Todos los campos son obligatorios.",
        });
      }

      if (typeof estudiante !== "string" || !estudiante.trim()) {
        return res.status(400).json({
          error: "El nombre del estudiante no es válido.",
        });
      }

      if (typeof email !== "string" || !email.trim().includes("@")) {
        return res.status(400).json({
          error: "El email no es válido.",
        });
      }

      if (!["Sala Norte", "Sala Sur", "Sala Multimedia"].includes(sala)) {
        return res.status(400).json({
          error: "La sala seleccionada no está permitida.",
        });
      }

      if (typeof fecha !== "string" || !fecha.trim()) {
        return res.status(400).json({
          error: "La fecha no es válida.",
        });
      }

      if (!["Mañana", "Tarde", "Noche"].includes(turno)) {
        return res.status(400).json({
          error: "El turno seleccionado no está permitido.",
        });
      }

      if (
        typeof personas !== "number" ||
        !Number.isInteger(personas) ||
        personas < 1 ||
        personas > 6
      ) {
        return res.status(400).json({
          error: "La cantidad de personas debe ser un entero entre 1 y 6.",
        });
      }

      // El estado no se recibe del cliente: MongoDB aplica
      // automáticamente el valor predeterminado "pendiente".
      const reserva = await servicio.crear({
        estudiante: estudiante.trim(),
        email: email.trim(),
        sala,
        fecha: fecha.trim(),
        turno,
        personas,
      });

      return res
        .status(201)
        .location(`/api/reservas/${reserva._id}`)
        .json(reserva);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          error: "Los datos de la reserva no son válidos.",
        });
      }

      next(error);
    }
  }

  return {
    listar,
    buscarPorId,
    crear,
  };
}

module.exports = crearControladorApiReservas;
