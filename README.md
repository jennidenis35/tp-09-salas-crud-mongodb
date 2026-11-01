# Trabajo Práctico 09 – CRUD de reservas de salas con MongoDB

## Introducción

En este trabajo práctico continué desarrollando el sistema de reservas de salas de estudio realizado en los trabajos anteriores.

En esta etapa amplié la API REST incorporando las operaciones necesarias para completar el CRUD (Crear, Leer, Actualizar y Eliminar), utilizando Node.js, Express, MongoDB Atlas y Mongoose.

El objetivo fue permitir la creación, consulta, modificación y eliminación de reservas, manteniendo los datos almacenados de forma permanente en la base de datos.

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

Tomé como base el trabajo práctico anterior y creé una nueva carpeta llamada `tp-09-salas-crud-mongodb`, para conservar el TP08 sin modificaciones.

La estructura principal del proyecto es la siguiente:

tp-09-salas-crud-mongodb/
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

Primero instalé las dependencias del proyecto mediante:


npm install


Luego configuré la conexión con MongoDB Atlas utilizando un archivo `.env`.

La estructura de las variables de entorno es:


PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u9?retryWrites=true&w=majority


Los datos reales de conexión se guardan de forma privada y no se suben a GitHub.

La base de datos utilizada es `reservas_salas_u9` y la colección es `reservas`.

Para iniciar la aplicación utilicé:


npm start


## Modelo de reservas

En el archivo `src/modelos/reserva.js` definí el modelo de las reservas utilizando Mongoose.

Los campos son:

- **estudiante:** nombre de quien realiza la reserva.
- **email:** correo electrónico.
- **sala:** sala seleccionada.
- **fecha:** fecha de la reserva.
- **turno:** turno seleccionado.
- **personas:** cantidad de personas.
- **estado:** situación de la reserva.

El campo `estado` permite los valores `pendiente` y `confirmada`, y tiene como valor predeterminado `pendiente`.

También incorporé validaciones para controlar los datos obligatorios, las salas y turnos permitidos y la cantidad de personas, que debe ser un número entero entre 1 y 6.

## Conexión con MongoDB Atlas

La conexión se realiza mediante los archivos ubicados en `src/config/`.

La aplicación establece la conexión con MongoDB Atlas antes de iniciar el servidor HTTP. De esta manera, comienza a recibir solicitudes solamente cuando la base de datos está disponible.

Para comprobar la conexión utilicé:


npm run db:check


La prueba confirmó que la conexión se estableció correctamente con `reservas_salas_u9` y finalizó sin crear reservas.

## Persistencia de las reservas

El almacenamiento de las reservas se realiza mediante el servicio ubicado en `src/servicios/reservas.js`.

Este servicio permite:

- Crear reservas.
- Listar todas las reservas.
- Buscar una reserva por su identificador.
- Contar las reservas.
- Modificar reservas.
- Eliminar reservas.

De esta manera, tanto la página web como la API trabajan con los mismos documentos almacenados en MongoDB Atlas.

## API REST y operaciones CRUD

En este trabajo amplié la API REST incorporando las operaciones de actualización y eliminación.

Las rutas se encuentran en `src/rutas/api-reservas.js` y utilizan las funciones del controlador ubicado en `src/controladores/api-reservas.js`.

Los endpoints implementados son:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/reservas` | Listar todas las reservas. |
| GET | `/api/reservas/:id` | Consultar una reserva por ID. |
| POST | `/api/reservas` | Crear una reserva. |
| PUT | `/api/reservas/:id` | Reemplazar los datos de una reserva. |
| PATCH | `/api/reservas/:id` | Modificar parcialmente una reserva. |
| DELETE | `/api/reservas/:id` | Eliminar una reserva. |

También mantuve el filtro por sala:


GET /api/reservas?sala=Sala%20Norte


Este permite consultar las reservas correspondientes a una sala determinada.

## Actualización de reservas mediante PUT

Utilicé el método HTTP `PUT` para reemplazar los datos editables de una reserva existente.

La solicitud debe incluir todos los campos requeridos, incluyendo el estado.

Si falta algún campo obligatorio o los datos no son válidos, el servidor responde con `400 Bad Request`.

Cuando la operación se realiza correctamente, devuelve `200 OK`.

## Actualización parcial mediante PATCH

Incorporé el método HTTP `PATCH` para modificar solamente algunos datos de una reserva.

En esta implementación se permite actualizar:

- La cantidad de personas.
- El estado de la reserva.

También se permite enviar ambos campos juntos.

El sistema rechaza los campos no permitidos, los cuerpos vacíos y los valores inválidos.

Por ejemplo:


{
  "personas": 5,
  "estado": "confirmada"
}


Si la actualización es correcta, la API responde con `200 OK`.

## Eliminación mediante DELETE

Utilicé el método HTTP `DELETE` para eliminar una reserva mediante su identificador de MongoDB.

Cuando la reserva existe y se elimina correctamente, el servidor responde con `204 No Content`.

Si se intenta consultar o eliminar una reserva que no existe, responde con `404 Not Found`.

## Validaciones y manejo de errores

Incorporé validaciones para proteger la información almacenada y evitar solicitudes incorrectas.

Entre los controles realizados se encuentran:

- Verificar que los campos obligatorios estén completos.
- Comprobar el formato básico del correo electrónico.
- Aceptar únicamente las salas y turnos permitidos.
- Controlar que la cantidad de personas sea un entero entre 1 y 6.
- Validar los identificadores de MongoDB.
- Rechazar campos no permitidos en las actualizaciones.
- Comprobar que la reserva exista antes de modificarla o eliminarla.

Los principales códigos HTTP utilizados son:

| Código | Significado |
|---|---|
| 200 | Solicitud procesada correctamente. |
| 201 | Reserva creada correctamente. |
| 204 | Reserva eliminada correctamente, sin contenido de respuesta. |
| 400 | Datos o solicitud inválidos. |
| 404 | Reserva o recurso no encontrado. |
| 500 | Error interno del servidor. |

## Pruebas con Postman

Utilicé Postman para comprobar el funcionamiento de los endpoints y sus respuestas.

Realicé las siguientes pruebas:

1. Consultar todas las reservas mediante GET.
2. Consultar una reserva por su identificador.
3. Crear una reserva mediante POST.
4. Reemplazar los datos de una reserva mediante PUT.
5. Modificar parcialmente la cantidad de personas mediante PATCH.
6. Modificar el estado mediante PATCH.
7. Rechazar campos no permitidos en PATCH.
8. Rechazar un PATCH vacío.
9. Rechazar una cantidad de personas superior a 6.
10. Rechazar un PUT incompleto.
11. Eliminar una reserva mediante DELETE.
12. Comprobar que la reserva eliminada devuelve 404.
13. Intentar eliminar nuevamente una reserva inexistente y comprobar el 404.
14. Comprobar que las solicitudes inválidas no modifican los datos.

Las pruebas permitieron verificar las respuestas HTTP y el correcto funcionamiento de las operaciones CRUD.

## Validación del formulario web

También comprobé que el formulario web continuara funcionando.

Para ello realicé una creación válida desde la página web y una prueba con una cantidad de personas fuera del límite permitido.

El formulario respondió correctamente y, ante los datos inválidos, el middleware rechazó la solicitud con `400 Bad Request`, mostrando el mensaje correspondiente y conservando los valores ingresados.

Esto permitió verificar que las validaciones se realizan también del lado del servidor.

## Persistencia después de reiniciar el servidor

Para comprobar la persistencia, creé una reserva, modifiqué sus datos mediante PATCH y detuve el servidor.

Luego volví a iniciarlo y consulté nuevamente la reserva mediante GET.

Comprobé que los datos modificados seguían almacenados en MongoDB Atlas, conservando el mismo identificador.

También verifiqué que la información aparecía correctamente en la página web.

De esta manera confirmé que las operaciones de actualización se guardan de forma permanente y no se pierden al reiniciar la aplicación.

## Revisión del código

Para mantener el código organizado y detectar posibles errores utilicé Prettier y ESLint.

Ejecuté:


npm run format


Y posteriormente:


npm run check


La verificación confirmó que los archivos tienen el formato correcto y que ESLint no encontró errores.

## Conclusión

Con este trabajo amplié el sistema de reservas incorporando las operaciones completas de una API REST mediante los métodos HTTP GET, POST, PUT, PATCH y DELETE.

Aprendí a crear, consultar, reemplazar, modificar parcialmente y eliminar documentos almacenados en MongoDB Atlas.

También trabajé con validaciones, respuestas HTTP, manejo de errores y pruebas mediante Postman.

Una de las comprobaciones más importantes fue verificar que los cambios permanecieran guardados después de reiniciar el servidor y que la página web y la API utilizaran la misma información.

Este trabajo me permitió comprender mejor el funcionamiento de las operaciones CRUD y la comunicación entre el cliente, el servidor y una base de datos persistente.

## Evidencias

Se incorporan capturas de pantalla como evidencia del desarrollo y las pruebas realizadas:

1. Conexión y base de datos en MongoDB Atlas.
2. Documentos almacenados en la colección `reservas`.
3. Inicio correcto del servidor.
4. Listado de reservas desde la página web.
5. Consulta general mediante GET.
6. Consulta individual mediante GET.
7. Creación de una reserva mediante POST.
8. Actualización completa mediante PUT.
9. Actualización parcial mediante PATCH.
10. Modificación del estado mediante PATCH.
11. Respuestas de validación `400 Bad Request`.
12. Eliminación mediante DELETE.
13. Respuestas `404 Not Found` posteriores a la eliminación.
14. Persistencia después de reiniciar el servidor.
15. Integración entre Postman, MongoDB Atlas y la página web.
16. Validación del formulario web.
17. Verificación final de Prettier y ESLint.
