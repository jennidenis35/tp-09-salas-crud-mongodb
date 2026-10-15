# Trabajo Práctico 07 – MongoDB Atlas y Mongoose

## Introducción

En este trabajo práctico continué con el sistema de reservas de salas de estudio que había realizado en el TP06.

En esta oportunidad aprendí a utilizar MongoDB Atlas para guardar información en una base de datos en la nube y Mongoose para trabajar con los datos desde Node.js.

El objetivo fue comprobar que las reservas se pueden guardar y consultar, y que la información no se borra cuando termina el programa.

## Herramientas utilizadas

Para realizar el trabajo utilicé:

- Visual Studio Code para escribir el código.
- Node.js para ejecutar los programas.
- Express para mantener funcionando la página web.
- MongoDB Atlas para almacenar las reservas.
- Mongoose para crear el modelo y validar los datos.
- Prettier y ESLint para revisar el código.

## Organización del proyecto

Tomé como base el TP06 y creé una carpeta nueva llamada `tp-07-salas-mongodb`, para no modificar el trabajo anterior.

Organicé los archivos de la siguiente manera:


tp-07-salas-mongodb/
├── public/
├── views/
├── src/
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   ├── modelos/
│   │   └── reserva.js
│   ├── controladores/
│   ├── middleware/
│   ├── rutas/
│   ├── servicios/
│   ├── app.js
│   └── index.js
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   ├── listar-reservas.js
│   └── probar-validaciones.js
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
└── README.md


## Instalación y configuración

Primero instalé las dependencias del proyecto:


npm install


Después instalé Mongoose:


npm install mongoose


Creé una cuenta en MongoDB Atlas y configuré un clúster gratuito llamado `Cluster0`.

También configuré un usuario y la conexión desde mi computadora.

Para guardar los datos de conexión utilicé un archivo `.env` con esta estructura:


PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u7?retryWrites=true&w=majority


Los datos reales de acceso se guardan de forma privada y no se suben a GitHub.

## Modelo de reservas

Creé el archivo `src/modelos/reserva.js`, donde definí los datos que debe tener cada reserva.

Los campos son:

- **estudiante:** nombre de quien realiza la reserva.
- **email:** correo electrónico.
- **sala:** sala que se desea reservar.
- **fecha:** día de la reserva.
- **turno:** mañana, tarde o noche.
- **personas:** cantidad de personas que utilizarán la sala.

También agregué validaciones para evitar datos incorrectos. Por ejemplo, no se pueden registrar más de seis personas, ingresar una sala que no exista o dejar el nombre del estudiante vacío.

## Prueba de conexión

Para comprobar la conexión creé el archivo `scripts/comprobar-conexion.js`.

Lo ejecuté con:


npm run db:check


Al principio tuve algunos problemas con la contraseña de MongoDB Atlas, pero después de corregir la conexión pude ingresar correctamente a la base de datos `reservas_salas_u7`.

El programa confirmó que la conexión funcionaba y luego la cerró.

## Crear una reserva

Después creé el archivo `scripts/crear-reserva.js`, que permite guardar una reserva en MongoDB Atlas.

Lo ejecuté con:


npm run db:create


Utilicé estos datos de prueba:

- Estudiante: Lucía Fernández.
- Email: lucia@example.com.
- Sala: Sala Norte.
- Fecha: 2026-10-20.
- Turno: Mañana.
- Personas: 2.

La reserva se guardó correctamente y MongoDB generó un identificador único.

## Consultar las reservas

Para consultar los datos guardados creé `scripts/listar-reservas.js`.

Ejecuté:


npm run db:list


El programa mostró la reserva de Lucía Fernández con todos sus datos.

También comprobé desde el explorador de MongoDB Atlas que la reserva estaba dentro de la base `reservas_salas_u7`, en la colección `reservas`.

De esta manera pude comprobar que la información seguía guardada aunque el programa de creación ya había terminado.

## Pruebas de validación

Para verificar que Mongoose rechaza los datos incorrectos, creé el archivo `scripts/probar-validaciones.js`.

Ejecuté:


npm run db:validate


Realicé siete pruebas:

1. Estudiante vacío.
2. Correo electrónico incorrecto.
3. Sala no permitida.
4. Turno no permitido.
5. Cantidad de personas igual a cero.
6. Cantidad de personas mayor a seis.
7. Cantidad de personas con decimales.

Las siete pruebas dieron resultado correcto porque Mongoose rechazó los datos inválidos.

Después volví a consultar las reservas y comprobé que seguía existiendo solamente una. Esto confirmó que las pruebas no habían guardado información incorrecta.

## Revisión del código

También utilicé Prettier y ESLint para mantener el código ordenado y detectar posibles errores.

Ejecuté:


npm run format


Y después:


npm run check


La terminal confirmó que todos los archivos tenían el formato correcto y que ESLint no encontró errores.

## Diferencia entre las reservas en memoria y MongoDB

Una de las cosas que aprendí en este trabajo es la diferencia entre guardar información en memoria y guardarla en una base de datos.

En la página web, las reservas todavía se manejan en memoria, como en el TP06. Esto significa que, si reinicio el servidor, vuelven a cargarse los datos iniciales.

En cambio, las reservas que guardé en MongoDB Atlas permanecen almacenadas aunque cierre Node.js o apague la computadora.

Por ahora utilicé MongoDB mediante programas independientes. No modifiqué las rutas de la página web para que consulten la base de datos.

## Conclusión

Con este trabajo aprendí a conectar un proyecto de Node.js con MongoDB Atlas, crear un modelo utilizando Mongoose y guardar y consultar documentos.

También aprendí a realizar validaciones para evitar que se guarden datos incorrectos y a proteger la información privada de conexión.

Lo más importante fue comprobar que una reserva guardada en MongoDB sigue estando disponible después de cerrar y volver a ejecutar el programa.

El TP07 me permitió conocer una nueva forma de almacenar información que puedo utilizar más adelante en otros sistemas y aplicaciones.

### Evidencia de la reserva guardada

En esta captura se puede observar la reserva que guardé
en MongoDB Atlas, dentro de la base de datos
`reservas_salas_u7` y la colección `reservas`.

![Reserva guardada en MongoDB Atlas](evidencias/reserva-mongodb.png.png)