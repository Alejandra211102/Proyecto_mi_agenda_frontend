import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2, Edit2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

// IMPORTANTE: Cambia esta URL si tu backend está en otro puerto
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AgendaPersonal() {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoEditar, setEventoEditar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_hora: '',
    prioridad: 'normal'
  });

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  useEffect(() => {
    cargarEventos();
    cargarNotificaciones();
    const interval = setInterval(() => {
      cargarEventos();
      cargarNotificaciones();
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const cargarEventos = async () => {
    try {
      const response = await fetch(`${API_URL}/eventos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEventos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      alert('Error al conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
      setLoading(false);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      const response = await fetch(`${API_URL}/notificaciones`);
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data);
        
        // Mostrar notificación del navegador si hay eventos próximos
        if (data.length > 0 && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            const evento = data[0];
            new Notification(`🔔 Evento próximo: ${evento.titulo}`, {
              body: `En ${evento.minutos_restantes} minutos`,
              icon: '/favicon.ico'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
        }
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const guardarEvento = async () => {
    if (!formData.titulo || !formData.fecha_hora) {
      alert('Título y fecha son obligatorios');
      return;
    }
    
    try {
      const url = eventoEditar 
        ? `${API_URL}/eventos/${eventoEditar.id}`
        : `${API_URL}/eventos`;
      
      const method = eventoEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await cargarEventos();
      cerrarModal();
      alert(eventoEditar ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente');
    } catch (error) {
      console.error('Error guardando evento:', error);
      alert('Error al guardar el evento');
    }
  };

  const eliminarEvento = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
      const response = await fetch(`${API_URL}/eventos/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await cargarEventos();
      alert('Evento eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento');
    }
  };

  const completarEvento = async (id) => {
    try {
      const response = await fetch(`${API_URL}/eventos/${id}/completar`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await cargarEventos();
    } catch (error) {
      console.error('Error completando evento:', error);
      alert('Error al completar el evento');
    }
  };

  const abrirEditar = (evento) => {
    setEventoEditar(evento);
    // Convertir la fecha del servidor a formato datetime-local
    const fechaEvento = new Date(evento.fecha_hora);
    const fechaLocal = new Date(fechaEvento.getTime() - fechaEvento.getTimezoneOffset() * 60000);
    const fechaStr = fechaLocal.toISOString().slice(0, 16);
    
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion || '',
      fecha_hora: fechaStr,
      prioridad: evento.prioridad
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEventoEditar(null);
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_hora: '',
      prioridad: 'normal'
    });
  };

  const abrirModalConFecha = (fecha) => {
    const fechaHora = new Date(fecha);
    fechaHora.setHours(9, 0, 0, 0);
    const fechaLocal = new Date(fechaHora.getTime() - fechaHora.getTimezoneOffset() * 60000);
    const fechaStr = fechaLocal.toISOString().slice(0, 16);
    
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_hora: fechaStr,
      prioridad: 'normal'
    });
    setMostrarModal(true);
  };

  const obtenerDiasDelMes = () => {
    const año = fechaSeleccionada.getFullYear();
    const mes = fechaSeleccionada.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    
    const diasAntes = primerDia.getDay();
    const diasMes = ultimoDia.getDate();
    
    const dias = [];
    
    // Días del mes anterior
    const mesAnterior = new Date(año, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diasAntes - 1; i >= 0; i--) {
      dias.push({
        dia: diasMesAnterior - i,
        esMesActual: false,
        fecha: new Date(año, mes - 1, diasMesAnterior - i)
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= diasMes; i++) {
      dias.push({
        dia: i,
        esMesActual: true,
        fecha: new Date(año, mes, i)
      });
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        dia: i,
        esMesActual: false,
        fecha: new Date(año, mes + 1, i)
      });
    }
    
    return dias;
  };

  const mesAnterior = () => {
    setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() - 1));
  };

  const mesSiguiente = () => {
    setFechaSeleccionada(new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1));
  };

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esFechaSeleccionada = (fecha) => {
    if (!fechaSeleccionada) return false;
    return fecha.toDateString() === fechaSeleccionada.toDateString();
  };

  const obtenerEventosDeFecha = (fecha) => {
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fecha_hora);
      return fechaEvento.toDateString() === fecha.toDateString();
    });
  };

  const obtenerEventosDelDia = () => {
    return obtenerEventosDeFecha(fechaSeleccionada).sort((a, b) => 
      new Date(a.fecha_hora) - new Date(b.fecha_hora)
    );
  };

  const getColorPrioridad = (prioridad) => {
    const colores = {
      urgente: 'bg-red-500',
      importante: 'bg-yellow-500',
      normal: 'bg-green-500',
      leve: 'bg-blue-500'
    };
    return colores[prioridad] || colores.normal;
  };

  const getColorPrioridadBorde = (prioridad) => {
    const colores = {
      urgente: 'border-red-500',
      importante: 'border-yellow-500',
      normal: 'border-green-500',
      leve: 'border-blue-500'
    };
    return colores[prioridad] || colores.normal;
  };

  const getColorBotonPrioridad = (prioridad, esSeleccionado) => {
    const colores = {
      leve: esSeleccionado ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      normal: esSeleccionado ? 'bg-green-500 text-white shadow-lg' : 'bg-green-50 text-green-700 hover:bg-green-100',
      importante: esSeleccionado ? 'bg-yellow-500 text-white shadow-lg' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      urgente: esSeleccionado ? 'bg-red-500 text-white shadow-lg' : 'bg-red-50 text-red-700 hover:bg-red-100'
    };
    return colores[prioridad] || colores.normal;
  };

  const dias = obtenerDiasDelMes();
  const eventosDelDia = obtenerEventosDelDia();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-white font-semibold mb-4">Cargando...</div>
          <div className="text-white/80">Conectando con el servidor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mi Agenda
                </h1>
                <p className="text-gray-500 text-sm">Organiza tu vida</p>
              </div>
            </div>
            <button
              onClick={() => abrirModalConFecha(fechaSeleccionada)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nuevo
            </button>
          </div>

          {/* Panel de Notificaciones */}
          {notificaciones.length > 0 && (
            <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-orange-500 text-2xl">🔔</div>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-800 mb-2">Eventos Próximos</h3>
                  <div className="space-y-2">
                    {notificaciones.map(notif => (
                      <div key={notif.id} className="text-sm text-orange-700">
                        <span className="font-semibold">{notif.titulo}</span> - 
                        <span className="ml-1">
                          En {notif.minutos_restantes} minuto{notif.minutos_restantes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navegación del calendario */}
          <div className="flex items-center justify-between">
            <button
              onClick={mesAnterior}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {meses[fechaSeleccionada.getMonth()]} {fechaSeleccionada.getFullYear()}
            </h2>
            <button
              onClick={mesSiguiente}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendario */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {diasSemana.map(dia => (
                  <div key={dia} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-2">
                {dias.map((diaInfo, index) => {
                  const eventosDelDia = obtenerEventosDeFecha(diaInfo.fecha);
                  const esHoyDia = esHoy(diaInfo.fecha);
                  const esSeleccionado = esFechaSeleccionada(diaInfo.fecha);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setFechaSeleccionada(diaInfo.fecha)}
                      className={`
                        aspect-square rounded-xl p-2 transition-all relative
                        ${!diaInfo.esMesActual ? 'opacity-30' : ''}
                        ${esHoyDia ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg' : ''}
                        ${esSeleccionado && !esHoyDia ? 'bg-purple-100 ring-2 ring-purple-500' : ''}
                        ${!esHoyDia && !esSeleccionado ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      <div className="text-sm font-semibold mb-1">
                        {diaInfo.dia}
                      </div>
                      {eventosDelDia.length > 0 && (
                        <div className="flex justify-center gap-1 flex-wrap">
                          {eventosDelDia.slice(0, 3).map((evento, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${getColorPrioridad(evento.prioridad)} ${esHoyDia ? 'bg-white' : ''}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Eventos del día seleccionado */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {esHoy(fechaSeleccionada) ? 'Hoy' : fechaSeleccionada.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                </h3>
                <span className="text-sm text-gray-500">
                  {eventosDelDia.length} evento{eventosDelDia.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {eventosDelDia.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Sin eventos</p>
                    <p className="text-gray-400 text-sm mt-1">Agrega uno nuevo</p>
                  </div>
                ) : (
                  eventosDelDia.map(evento => (
                    <div
                      key={evento.id}
                      className={`
                        p-4 rounded-2xl border-l-4 transition-all
                        ${getColorPrioridadBorde(evento.prioridad)}
                        ${evento.completado ? 'bg-gray-50 opacity-60' : 'bg-white shadow-md hover:shadow-lg'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`font-semibold text-gray-800 mb-1 ${evento.completado ? 'line-through' : ''}`}>
                            {evento.titulo}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(evento.fecha_hora).toLocaleTimeString('es-CO', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        {!evento.completado && (
                          <button
                            onClick={() => completarEvento(evento.id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {evento.descripcion && (
                        <p className="text-sm text-gray-600 mb-3">{evento.descripcion}</p>
                      )}

                      <div className="flex gap-2">
                        {!evento.completado && (
                          <button
                            onClick={() => abrirEditar(evento)}
                            className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                        )}
                        <button
                          onClick={() => eliminarEvento(evento.id)}
                          className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {eventoEditar ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={e => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Nombre del evento"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                  rows="3"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  value={formData.fecha_hora}
                  onChange={e => setFormData({...formData, fecha_hora: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prioridad *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'leve', label: 'Leve' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'importante', label: 'Importante' },
                    { value: 'urgente', label: 'Urgente' }
                  ].map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setFormData({...formData, prioridad: p.value})}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        getColorBotonPrioridad(p.value, formData.prioridad === p.value)
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarEvento}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition font-medium shadow-lg"
                >
                  {eventoEditar ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}