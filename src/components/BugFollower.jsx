// src/components/BugFollower.jsx
import React, { useState, useEffect, useRef } from 'react';
import './BugFollower.css';

function BugFollower() {
    // 1. Estado para guardar la última posición conocida del mouse
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // 2. Referencias para obtener la posición exacta de los elementos de los ojos en la pantalla
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);

    // 🚨 NUEVAS REFERENCIAS: Para guardar el ÚLTIMO ángulo de rotación aplicado a cada ojo
    const lastLeftAngle = useRef(0);
    const lastRightAngle = useRef(0);

    // 3. Hook para manejar el evento de movimiento del mouse
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Actualiza el estado con la posición del cursor
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        // Escucha los movimientos del mouse en todo el documento
        document.addEventListener('mousemove', handleMouseMove);

        // Función de limpieza: remueve el listener al desmontar el componente
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // 🚨 NUEVA FUNCIÓN CLAVE: Asegura que la transición tome el camino más corto
    const getShortestRotation = (currentAngleDeg, lastAngleRef) => {
        let currentAngle = currentAngleDeg;
        let lastAngle = lastAngleRef.current;

        // Bucle para normalizar el nuevo ángulo a ± 180 grados del ángulo anterior
        // Esto evita que la diferencia sea > 180 grados (el camino largo)
        while (currentAngle - lastAngle > 180) {
            currentAngle -= 360;
        }
        while (currentAngle - lastAngle < -180) {
            currentAngle += 360;
        }

        // 💡 OPTIMIZACIÓN: Solo actualiza la referencia si el ángulo ha cambiado lo suficiente
        // para asegurar que el componente se re-renderice solo cuando es necesario.
        // En este caso, lo actualizaremos siempre para que el próximo cálculo sea correcto.
        lastAngleRef.current = currentAngle;

        return currentAngle;
    };

    // 4. Función clave: Calcula el ángulo de rotación base
    const getEyeRotation = (eyeRef, lastAngleRef) => {
        if (!eyeRef.current) return '0deg';

        // ... (Tu lógica existente para calcular el ángulo base)
        const eyeRect = eyeRef.current.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;
        const deltaX = mousePosition.x - eyeX;
        const deltaY = mousePosition.y - eyeY;
        const angleRad = Math.atan2(deltaY, deltaX);
        let angleDeg = angleRad * (180 / Math.PI) + 90; // Ángulo base

        // 🚨 APLICACIÓN DE LA LÓGICA DEL CAMINO MÁS CORTO
        const shortestAngle = getShortestRotation(angleDeg, lastAngleRef);

        // Retorna la rotación ajustada como un string de estilo CSS.
        return `${shortestAngle}deg`;
    };

    // 5. Aplicación de los estilos dinámicos de rotación
    const leftEyeTransform = { 
        transform: `rotate(${getEyeRotation(leftEyeRef, lastLeftAngle)})` 
    };
    const rightEyeTransform = { 
        transform: `rotate(${getEyeRotation(rightEyeRef, lastRightAngle)})` 
    };

    // 6. Renderizado (sin cambios)
    return (
        <div className="bug-container">
            {/* Ojo Izquierdo */}
            <div 
                ref={leftEyeRef} 
                className="bug-eye" 
                style={leftEyeTransform} // Rotación dinámica aquí
            >
                <div className="bug-pupil"></div>
            </div>
            {/* Ojo Derecho */}
            <div 
                ref={rightEyeRef} 
                className="bug-eye" 
                style={rightEyeTransform} // Rotación dinámica aquí
            >
                <div className="bug-pupil"></div>
            </div>
        </div>
    );
}

export default BugFollower;