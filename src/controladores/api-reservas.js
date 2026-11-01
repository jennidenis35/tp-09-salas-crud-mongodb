function crearControladorApiReservas(servicio) {
  const camposPUT = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const camposPOST = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
  ];

  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  const estadosPermitidos = ["pendiente", "confirmada"];

  // Comprobar que el cuerpo sea un objeto JSON.
  function esObjetoValido(body) {
    return body !== null && typeof body === "object" && !Array.isArray(body);
  }

  // Validar el identificador de MongoDB.
  function esIdValido(id) {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }

  // Comprobar que no existan campos desconocidos.
  function tieneCamposDesconocidos(datos, permitidos) {
    return Object.keys(datos).some((campo) => !permitidos.includes(campo));
  }

  // Validar y normalizar la cantidad de personas.
  function validarPersonas(valor) {
    if (!(
      typeof valor === "number" ||
      (typeof valor === "string" && valor.trim() !== "")
    )) {
      return null;
    }

    const personas = Number(valor);

    if (
      !Number.isFinite(personas) ||
      !Number.isInteger(personas) ||
      personas < 1 ||
      personas > 6
    ) {
      return null;
    }

    return personas;
  }

  // Validar los campos comunes de una reserva.
  function validarCamposComunes(datos) {
    if (typeof datos.estudiante !== "string" || !datos.estudiante.trim()) {
      return "El nombre del estudiante no es válido.";
    }

    if (typeof datos.email !== "string" || !datos.email.trim().includes("@")) {
      return "El email no es válido.";
    }

    if (!salasPermitidas.includes(datos.sala)) {
      return "La sala seleccionada no está permitida.";
    }

    if (typeof datos.fecha !== "string" || !datos.fecha.trim()) {
      return "La fecha no es válida.";
    }

    if (!turnosPermitidos.includes(datos.turno)) {
      return "El turno seleccionado no está permitido.";
    }

    return null;
  }

  // Construir los datos normalizados de una reserva.
  function normalizarReserva(datos) {
    return {
      estudiante: datos.estudiante.trim(),
      email: datos.email.trim(),
      sala: datos.sala,
      fecha: datos.fecha.trim(),
      turno: datos.turno,
      personas: validarPersonas(datos.personas),
      estado: datos.estado,
    };
  }

  // GET /api/reservas
  async function listar(req, res, next) {
    try {
      const { sala } = req.query;

      if (Object.keys(req.query).some((clave) => clave !== "sala")) {
        return res.status(400).json({
          error: "Solo se permite el filtro sala.",
        });
      }

      if (Array.isArray(sala)) {
        return res.status(400).json({
          error: "El parámetro sala no puede repetirse.",
        });
      }

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

      if (!esIdValido(id)) {
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
      if (!esObjetoValido(req.body)) {
        return res.status(400).json({
          error: "El cuerpo debe ser un objeto JSON.",
        });
      }

      if (tieneCamposDesconocidos(req.body, camposPOST)) {
        return res.status(400).json({
          error: "Se enviaron campos no permitidos.",
        });
      }

      const datos = req.body;

      if (
        camposPOST.some(
          (campo) =>
            datos[campo] === undefined ||
            datos[campo] === null ||
            datos[campo] === "",
        )
      ) {
        return res.status(400).json({
          error: "Todos los campos son obligatorios.",
        });
      }

      const errorComun = validarCamposComunes(datos);

      if (errorComun) {
        return res.status(400).json({ error: errorComun });
      }

      const personas = validarPersonas(datos.personas);

      if (personas === null || typeof datos.personas !== "number") {
        return res.status(400).json({
          error: "La cantidad de personas debe ser un entero entre 1 y 6.",
        });
      }

      const reserva = await servicio.crear({
        estudiante: datos.estudiante.trim(),
        email: datos.email.trim(),
        sala: datos.sala,
        fecha: datos.fecha.trim(),
        turno: datos.turno,
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

  // PUT /api/reservas/:id
  async function reemplazar(req, res, next) {
    try {
      const { id } = req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          error: "El identificador de reserva no es válido.",
        });
      }

      if (!esObjetoValido(req.body)) {
        return res.status(400).json({
          error: "El cuerpo debe ser un objeto JSON.",
        });
      }

      const datos = req.body;

      if (tieneCamposDesconocidos(datos, camposPUT)) {
        return res.status(400).json({
          error: "Se enviaron campos no permitidos.",
        });
      }

      if (
        camposPUT.some(
          (campo) =>
            datos[campo] === undefined ||
            datos[campo] === null ||
            datos[campo] === "",
        )
      ) {
        return res.status(400).json({
          error: "PUT requiere los siete campos editables.",
        });
      }

      const errorComun = validarCamposComunes(datos);

      if (errorComun) {
        return res.status(400).json({ error: errorComun });
      }

      if (!estadosPermitidos.includes(datos.estado)) {
        return res.status(400).json({
          error: "El estado no está permitido.",
        });
      }

      const personas = validarPersonas(datos.personas);

      if (personas === null) {
        return res.status(400).json({
          error: "La cantidad de personas debe ser un entero entre 1 y 6.",
        });
      }

      const reserva = await servicio.reemplazar(id, {
        ...normalizarReserva(datos),
        personas,
      });

      if (!reserva) {
        return res.status(404).json({
          error: "La reserva solicitada no existe.",
        });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          error: "Los datos de la reserva no son válidos.",
        });
      }

      next(error);
    }
  }

  // PATCH /api/reservas/:id
  async function actualizarParcial(req, res, next) {
    try {
      const { id } = req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          error: "El identificador de reserva no es válido.",
        });
      }

      if (!esObjetoValido(req.body)) {
        return res.status(400).json({
          error: "El cuerpo debe ser un objeto JSON.",
        });
      }

      const datos = req.body;
      const camposPermitidos = ["personas", "estado"];

      if (
        Object.keys(datos).length === 0 ||
        tieneCamposDesconocidos(datos, camposPermitidos)
      ) {
        return res.status(400).json({
          error: "PATCH requiere personas, estado o ambos.",
        });
      }

      const cambios = {};

      if (Object.hasOwn(datos, "personas")) {
        const personas = validarPersonas(datos.personas);

        if (personas === null) {
          return res.status(400).json({
            error: "La cantidad de personas debe ser un entero entre 1 y 6.",
          });
        }

        cambios.personas = personas;
      }

      if (Object.hasOwn(datos, "estado")) {
        if (!estadosPermitidos.includes(datos.estado)) {
          return res.status(400).json({
            error: "El estado no está permitido.",
          });
        }

        cambios.estado = datos.estado;
      }

      const reserva = await servicio.actualizarParcial(id, cambios);

      if (!reserva) {
        return res.status(404).json({
          error: "La reserva solicitada no existe.",
        });
      }

      return res.status(200).json(reserva);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          error: "Los datos de la reserva no son válidos.",
        });
      }

      next(error);
    }
  }

  // DELETE /api/reservas/:id
  async function eliminar(req, res, next) {
    try {
      const { id } = req.params;

      if (!esIdValido(id)) {
        return res.status(400).json({
          error: "El identificador de reserva no es válido.",
        });
      }

      const reserva = await servicio.eliminar(id);

      if (!reserva) {
        return res.status(404).json({
          error: "La reserva solicitada no existe.",
        });
      }

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return {
    listar,
    buscarPorId,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
  };
}

module.exports = crearControladorApiReservas;
