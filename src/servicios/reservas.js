function crearServicioReservas(datosIniciales) {
  const reservas = datosIniciales.map((reserva) => ({
    ...reserva,
  }));

  function listar() {
    return reservas.map((reserva) => ({
      ...reserva,
    }));
  }

  function buscarPorId(id) {
    const reserva = reservas.find((item) => item.id === id);

    return reserva ? { ...reserva } : null;
  }

  function contar() {
    return reservas.length;
  }

  function crear(datosReserva) {
    const ultimoId =
      reservas.length > 0
        ? Math.max(...reservas.map((reserva) => reserva.id))
        : 0;

    const nuevaReserva = {
      id: ultimoId + 1,
      ...datosReserva,
    };

    reservas.push(nuevaReserva);

    return { ...nuevaReserva };
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = crearServicioReservas;
