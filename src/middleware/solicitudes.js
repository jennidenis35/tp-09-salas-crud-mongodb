let contadorSolicitudes = 0;

// Asigna un identificador único y consecutivo
// a cada solicitud HTTP.
function identificarSolicitud(req, res, next) {
  contadorSolicitudes++;

  const solicitudId = `BIB-${String(contadorSolicitudes).padStart(4, "0")}`;

  res.locals.solicitudId = solicitudId;

  next();
}

// Calcula la duración cuando termina la respuesta.
function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();

    const duracionMs = Number(fin - inicio) / 1_000_000;

    console.log(
      `[${res.locals.solicitudId}] ` +
        `${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ` +
        `${duracionMs.toFixed(2)} ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
