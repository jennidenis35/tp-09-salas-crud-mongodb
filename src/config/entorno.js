function obtenerConfiguracion() {
  const puertoTexto = process.env.PORT;

  const puerto = puertoTexto === undefined ? 3000 : Number(puertoTexto);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error("PORT debe ser un número entero entre 1 y 65535.");
  }

  const entorno = process.env.NODE_ENV || "development";

  const formatoMorgan = entorno === "production" ? "combined" : "dev";

  return {
    puerto,
    entorno,
    formatoMorgan,
  };
}

function obtenerMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (
    !uri ||
    !(uri.startsWith("mongodb+srv://") || uri.startsWith("mongodb://"))
  ) {
    throw new Error(
      "MONGODB_URI no está configurada o tiene un formato inválido.",
    );
  }

  return uri;
}

module.exports = {
  obtenerConfiguracion,
  obtenerMongoUri,
};
