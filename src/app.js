const express = require("express");
const path = require("node:path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const crearRouterReservas = require("./rutas/reservas");
const crearRouterApiReservas = require("./rutas/api-reservas");

function crearApp(controlador, controladorApi, configuracion) {
  const app = express();

  // Configuración de las vistas EJS.
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  // Middleware globales.
  app.use(morgan(configuracion.formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  // Layout principal.
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  // Archivos estáticos.
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Interpretación de formularios y JSON.
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Rutas generales.
  app.get("/", controlador.mostrarInicio);
  app.get("/estado", controlador.mostrarEstado);

  // Rutas de la API.
  app.use("/api/reservas", crearRouterApiReservas(controladorApi));

  // Rutas de la página web.
  app.use("/reservas", crearRouterReservas(controlador));

  // Error para rutas inexistentes de la API.
  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "Ruta de API no encontrada.",
    });
  });

  // Página HTML para rutas inexistentes.
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  // Middleware general de errores.
  app.use((error, req, res, next) => {
    console.error("Error en la aplicación:", error.name || "Error");

    if (res.headersSent) {
      return next(error);
    }

    // JSON mal formado: responder 400.
    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      "body" in error
    ) {
      if (req.originalUrl.startsWith("/api")) {
        return res.status(400).json({
          error: "El JSON enviado no tiene un formato válido.",
        });
      }

      return res
        .status(400)
        .send("Los datos enviados no tienen un formato válido.");
    }

    // Errores de la API: responder siempre JSON.
    if (req.originalUrl.startsWith("/api")) {
      return res.status(500).json({
        error: "Error interno del servidor.",
      });
    }

    // Errores de las páginas HTML.
    return res.status(500).render("no-encontrado", {
      titulo: "Error del servidor",
      mensaje: "Ocurrió un error al procesar la solicitud.",
    });
  });

  return app;
}

module.exports = crearApp;
