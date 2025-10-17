// src/components/CatFollower.jsx
import React, { useState, useEffect, useRef } from 'react';
import './CatFollower.css'; 

function CatFollower() {
    // 1. Estado para guardar la última posición conocida del mouse
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
     // 🚨 CORRECCIÓN: Agregamos el estado para controlar la ventana/modal
    const [showCatWindow, setShowCatWindow] = useState(false); 
    // 2. Referencias para obtener la posición exacta de los elementos de los ojos en la pantalla
    const leftEyeWrapperRef = useRef(null); 
    const rightEyeWrapperRef = useRef(null);
    // 🚨 NUEVA REFERENCIA: Para el elemento de audio HTML
    const audioRef = useRef(null); 

    // 🚨 AJUSTE 1: Inicializamos los ángulos a 0, tal como en BugFollower (aunque la rotación base es 90)
    const lastLeftAngle = useRef(0); 
    const lastRightAngle = useRef(0); 

    const handleCatClick = (e) => {
        // Detener el evento de propagarse para evitar cerrarlo inmediatamente si es un click dentro del modal
        e.stopPropagation();
        setShowCatWindow(true);
    };

    // 🚨 NUEVA FUNCIÓN: Cierra el modal cuando se hace click en el fondo
    const handleModalClose = (e) => {
        // Solo cerramos si el click fue directamente en el fondo del modal (.cat-modal)
        if (e.target.className.includes('cat-modal')) {
            setShowCatWindow(false);
        }
    };
    
    // 🚨 NUEVA FUNCIÓN: Cierre explícito (por ejemplo, para un botón)
    const closeWindow = () => {
        setShowCatWindow(false);
    };

    // // 🚨 useEffect MODIFICADO para el Audio
    useEffect(() => {
        // Se ejecuta cada vez que 'showCatWindow' cambia
        if (audioRef.current) {
            if (showCatWindow) {
                // 🔊 REPRODUCIR cuando el modal se ABRE
                audioRef.current.currentTime = 0; 
                audioRef.current.play().catch(error => {
                    console.warn("Error al reproducir el audio. Puede requerir interacción del usuario.", error);
                });
            } else {
                // 🔇 DETENER Y REINICIAR cuando el modal se CIERRA
                audioRef.current.pause();
                audioRef.current.currentTime = 0; 
            }
        }
    }, [showCatWindow]); // Dependencia: solo se dispara cuando el modal cambia su visibilidad



    // 3. Hook para manejar el evento de movimiento del mouse
    useEffect(() => {
        const handleMouseMove = (event) => {
            // Actualiza la posición del ratón continuamente
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        
        // Escucha SOLO 'mousemove' (comportamiento de BugFollower)
        document.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Array vacío = se ejecuta solo al montar y desmontar

    // 🚨 FUNCIÓN CLAVE: Asegura que la transición tome el camino más corto (Extraída de BugFollower)
    const getShortestRotation = (currentAngleDeg, lastAngleRef) => {
        let currentAngle = currentAngleDeg;
        let lastAngle = lastAngleRef.current;

        // Bucle para normalizar el nuevo ángulo a ± 180 grados del ángulo anterior
        while (currentAngle - lastAngle > 180) {
            currentAngle -= 360;
        }
        while (currentAngle - lastAngle < -180) {
            currentAngle += 360;
        }

        lastAngleRef.current = currentAngle;

        return currentAngle;
    };

    // 4. Función clave: Calcula el ángulo de rotación
    const getEyeRotation = (eyeWrapperRef, lastAngleRef) => {
        if (!eyeWrapperRef.current) return '0deg';

        const eyeRect = eyeWrapperRef.current.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;

        // El objetivo es SIEMPRE la posición del ratón (comportamiento BugFollower)
        const targetX = mousePosition.x;
        const targetY = mousePosition.y;

        const deltaX = targetX - eyeX;
        const deltaY = targetY - eyeY;

        // 💡 Corrección del punto muerto (evita la congelación cuando deltaX es 0)
        const EPSILON = 0.001; 
        const adjustedDeltaX = deltaX === 0 ? EPSILON : deltaX; 

        // 🚨 CÁLCULO BASE
        const angleRad = Math.atan2(deltaY, adjustedDeltaX); 
        let angleDeg = angleRad * (180 / Math.PI) + 90; // Ángulo base + compensación

        // 🚨 APLICACIÓN DE LA LÓGICA DEL CAMINO MÁS CORTO
        const shortestAngle = getShortestRotation(angleDeg, lastAngleRef);
        
        // 🚨 ELIMINAMOS LA LIMITACIÓN DE ÁNGULO: Para mantener la paridad, aunque es opcional y recomendable.
        // Si quieres mantener la limitación (MAX_REALISTIC_ANGLE), añádela aquí:
        // const MAX_REALISTIC_ANGLE = 170; 
        // const limitedAngle = Math.max(-MAX_REALISTIC_ANGLE, Math.min(MAX_REALISTIC_ANGLE, shortestAngle));
        // return `${limitedAngle}deg`; 
        
        return `${shortestAngle}deg`; 
    };

    // 5. Aplicación de los estilos dinámicos de rotación
    const leftEyeTransform = { 
        transform: `rotate(${getEyeRotation(leftEyeWrapperRef, lastLeftAngle)})` 
    };
    const rightEyeTransform = { 
        transform: `rotate(${getEyeRotation(rightEyeWrapperRef, lastRightAngle)})` 
    };

    // 6. Renderizado (ajustando los nombres de referencia)
    return (
        <div className="cat-face-container" onClick={handleCatClick}>
            {/* Ojo Izquierdo */}
            <div 
                ref={leftEyeWrapperRef} // Usa la referencia del wrapper
                className="cat-eye-wrapper cat-eye-left" 
                style={leftEyeTransform} 
            >
                <div className="bug-pupil"></div> 
            </div>

            {/* Ojo Derecho */}
            <div 
                ref={rightEyeWrapperRef} // Usa la referencia del wrapper
                className="cat-eye-wrapper cat-eye-right" 
                style={rightEyeTransform} 
            >
                <div className="bug-pupil"></div> 
            </div>

            {/* 🚨 AGREGAMOS EL ELEMENTO AUDIO, REFERENCIADO POR audioRef */}
            <audio ref={audioRef} src="./miau.mp3" preload="auto" /> 
              {/* 🚨 NUEVO: Ventana Modal/Popup */}
            {showCatWindow && (
                // 🚨 ESCUCHA EL CLICK EN EL FONDO para cerrar el modal
                <div className={`cat-modal active`} onClick={handleModalClose}> 
                    <div 
                        className="cat-modal-content" 
                        onClick={(e) => e.stopPropagation()} // 🚨 IMPIDE que el click en el contenido cierre el modal
                    >
                        <h2>¡Miau! Soy un gato.</h2>
                        <p>Me has encontrado. ¡Gracias por el click!</p>
                        <img src="/happy_cat.jpg" alt="Gato feliz" className="modal-cat-image"/> 
                        
                        {/* 🚨 Botón de cierre */}
                        <button className="close-button" onClick={closeWindow}>X</button>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default CatFollower;