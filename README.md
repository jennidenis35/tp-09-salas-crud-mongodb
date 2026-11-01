# Trabajo Práctico 08 – Endpoints persistentes de reservas de salas

## Introducción

En este trabajo práctico continué con el sistema de reservas de salas de estudio desarrollado en los trabajos anteriores.

En esta oportunidad incorporé una API REST utilizando Node.js y Express, conectada a MongoDB Atlas mediante Mongoose.

El objetivo fue lograr que las reservas se almacenen de forma permanente en la base de datos y que puedan consultarse tanto desde la página web como desde los endpoints de la API.

## Herramientas utilizadas

Para realizar el trabajo utilicé:

- Visual Studio Code para escribir y organizar el código.
- Node.js para ejecutar la aplicación.
- Express para gestionar las rutas y solicitudes HTTP.
- MongoDB Atlas para almacenar las reservas.
- Mongoose para definir el modelo y validar los datos.
- Postman para probar los endpoints de la API.
- Prettier y ESLint para revisar el código.

## Organización del proyecto

Tomé como base el TP07 y creé una carpeta nueva llamada `tp-08-salas-http-mongodb`, para conservar el trabajo anterior sin modificaciones.

La estructura principal del proyecto es la siguiente:


tp-08-salas-http-mongodb/
├── evidencias/
├── public/
├── views/
├── src/
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── controladores/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   ├── middleware/
│   │   ├── reservas.js
│   │   └── solicitudes.js
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   ├── servicios/
│   │   └── reservas.js
│   ├── app.js
│   └── index.js
├── scripts/
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
└── README.md


## Instalación y configuración

Primero instalé las dependencias del proyecto mediante el siguiente comando:

npm install


Luego configuré la conexión con MongoDB Atlas utilizando un archivo `.env`.

La estructura de las variables de entorno es:


PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u8?retryWrites=true&w=majority


Los datos reales de conexión se guardan de forma privada y no se suben a GitHub.

También configuré la base de datos `reservas_salas_u8` y la colección `reservas`.

Para iniciar la aplicación utilicé:


npm start


## Modelo de reservas

En el archivo `src/modelos/reserva.js` definí el modelo de las reservas utilizando Mongoose.

Los campos son:

- **estudiante:** nombre de quien realiza la reserva.
- **email:** correo electrónico.
- **sala:** sala que se desea reservar.
- **fecha:** fecha de la reserva.
- **turno:** turno seleccionado.
- **personas:** cantidad de personas que utilizarán la sala.
- **estado:** situación de la reserva.

El campo `estado` tiene como valor predeterminado `pendiente` y permite los valores `pendiente` y `confirmada`.

También incorporé validaciones para evitar datos incorrectos, como nombres vacíos, correos inválidos, salas no permitidas o cantidades de personas fuera del rango establecido.

El estado se asigna automáticamente al crear una reserva y no puede ser definido por el cliente mediante la API.

## Conexión con MongoDB Atlas

Para conectar la aplicación con MongoDB Atlas utilicé los archivos de configuración ubicados en `src/config/`.

La conexión se realiza antes de iniciar el servidor HTTP. De esta manera, la aplicación comienza a recibir solicitudes solamente cuando la base de datos está conectada correctamente.

Para comprobar la conexión utilicé:


npm run db:check


La terminal confirmó que la conexión con MongoDB Atlas se estableció correctamente y que la prueba finalizó sin crear reservas.

## Persistencia de las reservas

En este trabajo reemplacé el almacenamiento en memoria por consultas a MongoDB Atlas.

Para ello utilicé el servicio ubicado en `src/servicios/reservas.js`, que permite:

- Crear reservas.
- Listar todas las reservas.
- Buscar una reserva por su identificador.
- Contar las reservas registradas.

De esta manera, tanto la página web como la API utilizan los mismos datos almacenados en la base de datos.

## API REST y endpoints

Separé las rutas de la página web de las rutas de la API.

Las rutas de la API se encuentran en `src/rutas/api-reservas.js` y utilizan el controlador `src/controladores/api-reservas.js`.

Implementé los siguientes endpoints:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/reservas` | Listar todas las reservas. |
| GET | `/api/reservas/:id` | Consultar una reserva por ID. |
| POST | `/api/reservas` | Crear una nueva reserva. |

También incorporé el filtro por sala:


GET /api/reservas?sala=Sala%20Norte


Este filtro permite consultar únicamente las reservas correspondientes a la sala seleccionada.

La API valida los parámetros recibidos y rechaza aquellos que no están permitidos.

No se implementaron operaciones PUT, PATCH ni DELETE, ya que no forman parte de los endpoints solicitados.

## Creación de reservas mediante POST

Para crear reservas desde la API utilicé el método HTTP `POST`.

La solicitud recibe los datos de la reserva en formato JSON.

Ejemplo:


{
  "estudiante": "María González",
  "email": "maria.prueba@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-05",
  "turno": "Tarde",
  "personas": 3
}


Cuando los datos son correctos, la API responde con el código HTTP `201 Created`, devuelve la reserva creada y agrega el encabezado `Location` con la dirección del recurso.

El campo `estado` se genera automáticamente con el valor `pendiente`.

## Pruebas con Postman

Utilicé Postman para probar el funcionamiento de los endpoints y verificar las respuestas HTTP.

Realicé las siguientes pruebas:

1. Consultar todas las reservas mediante GET.
2. Consultar una reserva por su identificador.
3. Consultar un identificador mal formado y comprobar la respuesta `400 Bad Request`.
4. Consultar un identificador válido que no existe y comprobar la respuesta `404 Not Found`.
5. Filtrar reservas por sala.
6. Rechazar parámetros de consulta no permitidos.
7. Crear una reserva mediante POST y comprobar la respuesta `201 Created`.
8. Verificar el encabezado `Location`.
9. Recuperar la reserva creada mediante GET.
10. Enviar un JSON mal formado y comprobar que la API responda `400 Bad Request`.
11. Enviar una reserva con una cantidad de personas fuera del límite permitido y comprobar que sea rechazada.

Las pruebas confirmaron que la API responde correctamente y que los datos inválidos no generan nuevas reservas.

## Persistencia después de reiniciar el servidor

Una de las pruebas más importantes consistió en detener y volver a iniciar el servidor.

Después del reinicio consulté nuevamente las reservas mediante la API y comprobé que los registros seguían disponibles con los mismos identificadores.

También ingresé a la página web y verifiqué que las reservas creadas desde Postman aparecían en el listado.

Esto permitió comprobar que la página web y la API trabajan sobre la misma información almacenada en MongoDB Atlas.

Además, realicé consultas repetidas para comprobar que los registros no se duplicaran.

## Revisión del código

Para mantener el código ordenado y detectar errores utilicé Prettier y ESLint.

Ejecuté los siguientes comandos:


npm run format


Y luego:


npm run check


La verificación final confirmó que todos los archivos tienen el formato correcto y que ESLint no encontró errores.

## Conclusión

Con este trabajo aprendí a incorporar una API REST a un sistema de reservas y conectar sus endpoints con una base de datos MongoDB Atlas.

También aprendí a utilizar los métodos HTTP GET y POST, validar solicitudes, manejar respuestas como `200 OK`, `201 Created`, `400 Bad Request` y `404 Not Found`, y utilizar Postman para probar el funcionamiento de la API.

Lo más importante fue comprobar que las reservas se mantienen guardadas después de reiniciar el servidor y que tanto la página web como la API pueden consultar los mismos registros.

Este trabajo me permitió comprender mejor cómo funciona la comunicación entre el cliente, el servidor y una base de datos persistente.

## Evidencias

Se incorporan las siguientes capturas como evidencia de las pruebas realizadas durante el desarrollo del trabajo práctico:

1. Conexión y base de datos en MongoDB Atlas.
2. Documentos almacenados en la colección `reservas`.
3. Inicio correcto del servidor y conexión con MongoDB Atlas.
4. Listado de reservas desde la página web.
5. Consulta general mediante GET.
6. Consulta individual mediante GET.
7. Creación de una reserva mediante POST.
8. Respuesta `201 Created` y encabezado `Location`.
9. Respuesta de error `400 Bad Request`.
10. Respuesta de error `404 Not Found`.
11. Filtro de reservas por sala.
12. Integración entre la API y la página web.
13. Persistencia de las reservas después de reiniciar el servidor.
14. Verificación final de Prettier y ESLint.
