// --- Control de la música ---
const musicButton = document.getElementById('music-button');
const audio = document.getElementById('birthday-music');

// Función para sincronizar el texto del botón con el estado del audio
function updateButtonState() {
    // Usamos un operador ternario para un código más conciso
    musicButton.textContent = audio.paused ? '▶️ Poner Música' : '⏸️ Pausar Música';
}

// El botón simplemente alterna entre reproducir y pausar
musicButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(e => console.log("El usuario necesita interactuar con la página primero."));
    } else {
        audio.pause();
    }
});

// Escuchamos los eventos del audio para mantener el botón actualizado,
audio.addEventListener('play', updateButtonState);
audio.addEventListener('pause', updateButtonState);

// --- Lógica para Autoplay de Música ---
// Los navegadores modernos bloquean el autoplay con sonido. Esta función intenta 
// reproducir la música y si falla, espera la interacción del usuario.
window.addEventListener('load', () => {
    // Actualiza el estado del botón al cargar la página
    updateButtonState();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("El autoplay fue bloqueado por el navegador. Se requiere un clic.");
            // No es necesario hacer nada más, el botón ya muestra "Poner Música".
        });
    }
});

// --- Efecto de Lluvia de Corazones ---
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
const colors = ['#e91e63', '#d81b60', '#f06292', '#f8bbd0', '#ff80ab'];

function createHearts() {
    hearts = []; // Limpiamos el array para regenerar en caso de redimensionar

    // Para un rendimiento perfecto en celular, reducimos la cantidad de elementos
    const isMobile = window.innerWidth <= 600;
    const numberOfHearts = isMobile ? 40 : 100;
    const numberOfTexts = isMobile ? 5 : 12;

    for (let i = 0; i < numberOfHearts; i++) {
        hearts.push({
            type: 'heart', // Especificamos que es un corazón
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 15 + 10, // Corazones un poco más grandes
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * 2 * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    // Añadimos una mezcla de textos que también caen
    const fallingTexts = ['Lady Mabel', 'Feliz Cumpleaños'];

    for (let i = 0; i < numberOfTexts; i++) {
        const text = fallingTexts[Math.floor(Math.random() * fallingTexts.length)];
        hearts.push({
            type: 'text', // Especificamos que es texto
            text: text,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: text === 'Feliz Cumpleaños' ? Math.random() * 15 + 20 : Math.random() * 20 + 25, // Hacemos "Feliz Cumpleaños" un poco más pequeño para que quepa mejor
            color: colors[Math.floor(Math.random() * colors.length)], // Usamos colores variados
            speed: Math.random() * 1 + 1, // Velocidad un poco más lenta para leerse mejor
            rotation: (Math.random() - 0.5) * 0.3,
            rotationSpeed: (Math.random() - 0.5) * 0.002 // Rotación suave
        });
    }
}

// Función para dibujar un corazón
function drawHeart(x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size / 4);
    ctx.bezierCurveTo(0, -size / 2, -size / 2, -size / 2, -size / 2, -size / 4);
    ctx.bezierCurveTo(-size / 2, 0, 0, 0, 0, size / 4);
    ctx.bezierCurveTo(0, 0, size / 2, 0, size / 2, -size / 4);
    ctx.bezierCurveTo(size / 2, -size / 2, 0, -size / 2, 0, -size / 4);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

// Función para dibujar el texto que cae
function drawFallingText(text, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    // Usamos la misma fuente elegante del título para consistencia
    ctx.font = `bold ${size}px "Dancing Script"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.y += heart.speed;
        heart.rotation += heart.rotationSpeed;

        // Si el corazón sale de la pantalla, lo reinicia arriba
        if (heart.y > canvas.height + heart.size) {
            heart.x = Math.random() * canvas.width;
            heart.y = -heart.size;
        }

        // Dependiendo del tipo, dibujamos un corazón o el nombre
        if (heart.type === 'text') {
            drawFallingText(heart.text, heart.x, heart.y, heart.size, heart.color, heart.rotation);
        } else {
            drawHeart(heart.x, heart.y, heart.size, heart.color, heart.rotation);
        }
    });
    requestAnimationFrame(animateHearts);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createHearts(); // Regeneramos los corazones con la cantidad adecuada para el nuevo tamaño
});

createHearts(); // Llamada inicial para crear los corazones
animateHearts();