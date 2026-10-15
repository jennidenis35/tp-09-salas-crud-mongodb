const express = require("express");
const path = require("node:path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const crearRouterReservas = require("./rutas/reservas");

function crearApp(controlador, configuracion) {
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

  // Router de reservas.
  app.use("/reservas", crearRouterReservas(controlador));

  // Middleware final para páginas inexistentes.
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = crearApp;
