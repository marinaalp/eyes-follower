import React, { useState, useEffect } from 'react';

const GatitoSeguidor = ({ imagenSrc }) => {
  // 1. Estado para guardar las coordenadas del cursor
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 2. Lógica para manejar el movimiento del mouse
  useEffect(() => {
    // Función que actualiza el estado con las coordenadas del evento
    const handleMouseMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Añadir el escuchador de eventos al documento
    document.addEventListener('mousemove', handleMouseMove);

    // Función de limpieza para remover el escuchador cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montarse

  // 3. Renderizado y aplicación de estilos dinámicos
  return (
    <img
      src={imagenSrc} // La ruta de tu imagen de gatito
      alt="Gatito que sigue el cursor"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', 
        
        // ✨ CLAVE 1: Permite que el mouse "pase a través"
        pointerEvents: 'none', 
        
        width: '50px',
        height: 'auto',
        
        // ✨ CLAVE 2: Asegura que el gatito esté en la capa superior
        zIndex: 9999, 
      }}
    />
  );
};

export default GatitoSeguidor;