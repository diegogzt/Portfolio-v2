function areaAuto() {
    const input = document.getElementById('user-input');

    input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("button");

function addMessage(role, message) {
    areaAuto();
    const div = document.createElement("div");
    div.className = `message ${role}-message`;

    // Avatar del usuario o bot
    const avatarDiv = document.createElement("div");
    avatarDiv.className = role === "user" ? "user-avatar" : "bot-avatar";
    avatarDiv.innerHTML = role === "user" ?
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>';

    // Contenido del mensaje
    const contentDiv = document.createElement("div");

    // Verificar si el mensaje contiene una URL de imagen
    const imageMatch = message.match(/\[IMAGE_URL:(.*?)\]/);

    if (role === "bot" && imageMatch) {
        // Es un mensaje con imagen
        const imageUrl = imageMatch[1];
        const textContent = message.replace(/\[IMAGE_URL:.*?\]/, "").trim();

        // Texto del mensaje si hay
        if (textContent) {
            const textDiv = document.createElement("div");
            textDiv.className = "mb-2";
            textDiv.innerHTML = textContent.replace(/\*\*/g, '<br>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #a78bfa;" target="_blank">$1</a>');
            contentDiv.appendChild(textDiv);
        }

        // Imagen
        const imgContainer = document.createElement("div");
        imgContainer.className = "relative rounded-lg overflow-hidden border border-purple-500/30 mt-2";

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Generated Image";
        img.className = "w-full rounded-lg";
        img.style.maxWidth = "100%";

        // Loader mientras carga la imagen
        const loader = document.createElement("div");
        loader.className = "absolute inset-0 flex items-center justify-center bg-[#0d0020]/70";
        loader.innerHTML = '<div class="w-8 h-8 border-4 border-t-purple-500 border-purple-500/30 rounded-full animate-spin"></div>';

        imgContainer.appendChild(loader);
        imgContainer.appendChild(img);
        contentDiv.appendChild(imgContainer);

        // Quitar el loader cuando la imagen cargue
        img.onload = () => {
            imgContainer.removeChild(loader);
        };

        // Botón para abrir la imagen en otra pestaña
        const imgLinkDiv = document.createElement("div");
        imgLinkDiv.className = "mt-2 text-right";
        const imgLink = document.createElement("a");
        imgLink.href = imageUrl;
        imgLink.target = "_blank";
        imgLink.className = "text-xs text-purple-400 hover:text-purple-300";
        imgLink.textContent = "Ver imagen en tamaño completo";
        imgLinkDiv.appendChild(imgLink);
        contentDiv.appendChild(imgLinkDiv);
    } else {
        // Mensaje de texto normal
        contentDiv.innerHTML = role === "bot"
            ? message.replace(/\*\*/g, '<br>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #a78bfa;" target="_blank">$1</a>')
            : message;
    }

    // Añadir timestamp
    const timeDiv = document.createElement("div");
    timeDiv.className = "message-time";
    const now = new Date();
    timeDiv.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    div.appendChild(contentDiv);
    div.appendChild(timeDiv);

    chatBody.appendChild(div);
    chatBody.appendChild(avatarDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Mensaje de bienvenida al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        addMessage("bot", "👋 ¡Hola! Soy el asistente virtual de Diego. Estoy aquí para ayudarte con cualquier pregunta sobre sus proyectos, habilidades o experiencia. ¿En qué puedo ayudarte hoy?");
    }, 500);
});

function addLoadingMessage() {
    const div = document.createElement("div");
    div.className = "message bot loading";
    div.innerHTML = '<div class="loading-spinner"></div>';
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
}

// Global variable to track if we're currently retrying
let isRetrying = false;

async function sendMessage(retryCount = 0) {
    const message = userInput.value.trim();
    if (!message || message === '') {
        // No hacer nada si el mensaje está vacío
        return;
    }

    // Only add user message on first attempt, not on retries
    if (retryCount === 0) {
        addMessage("user", message);
        userInput.value = "";
        userInput.style.height = 'auto'; // Resetear la altura del textarea
    }

    userInput.disabled = true;
    sendButton.disabled = true;

    const loadingMessage = addLoadingMessage();

    // Set a local retry flag
    isRetrying = retryCount > 0;

    // Detect if it's an image request based on command prefixes
    const isImageRequest =
        message.toLowerCase().startsWith("/imagen ") ||
        message.toLowerCase().startsWith("/image ") ||
        message.toLowerCase().startsWith("/generar ");

    // Obtener el modelo seleccionado o usar 'replicate' si es una solicitud de imagen
    const modelSelector = document.getElementById('model-selector');
    let selectedModel = modelSelector.value || 'llama'; // Usar llama como fallback

    // Si es una solicitud de imagen, usar el modelo de Replicate directamente
    if (isImageRequest) {
        selectedModel = 'replicate';
    }

    try {
        // Obtener la URL base
        const baseUrl = window.location.origin;

        // Use a timeout promise to allow aborting long requests
        const fetchPromise = fetch(`${baseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                model: selectedModel  // Enviar el modelo seleccionado
            })
        });

        // Create a timeout promise - 60 segundos para imágenes, 25 para chat normal
        const timeoutDuration = isImageRequest ? 60000 : 25000;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);
        });

        // Race the fetch against the timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        chatBody.removeChild(loadingMessage);

        if (data.response) {
            addMessage("bot", data.response);
        } else if (data.imageUrl) {
            // Si recibimos directamente una URL de imagen (del endpoint generate-image)
            addMessage("bot", `¡He generado esta imagen para ti! [IMAGE_URL:${data.imageUrl}]`);
        } else {
            addMessage("bot", "Lo siento, ocurrió un error en la respuesta.");
        }

        // Reset retry flag
        isRetrying = false;

    } catch (error) {
        console.error("Error:", error);
        chatBody.removeChild(loadingMessage);

        // Obtener el modelo actualmente seleccionado para mensajes específicos
        const modelName = isImageRequest ? 'Replicate' : 'Llama 3';

        // Implement retry logic
        if (retryCount < 2) {  // Try up to 2 additional times
            addMessage("bot", `Estoy teniendo problemas para conectar con el servidor de ${modelName}. Intentando nuevamente... (${retryCount + 1}/3)`);
            setTimeout(() => sendMessage(retryCount + 1), 2000);  // Wait 2 seconds before retrying
        } else {
            // If all retries failed, show a fallback message
            let fallbackResponse = `Lo siento, parece que estoy teniendo dificultades para conectarme al servidor de ${modelName} en este momento.`;

            fallbackResponse += `\n\nPuedes contactar con Diego directamente:
- Email: tovard799@gmail.com
- Teléfono: +34 640 844 225
- LinkedIn: https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/`;

            addMessage("bot", fallbackResponse);
            isRetrying = false;
        }
    }

    // Only re-enable inputs if we're not in the middle of retrying
    if (!isRetrying) {
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isRetrying) {
            sendMessage();
        }
    }
});

// Agregar event listener para el botón de enviar
sendButton.addEventListener("click", function (event) {
    if (!isRetrying) {
        sendMessage();
    }
});

// Initialize the auto-sizing textarea when the page loads
document.addEventListener('DOMContentLoaded', function () {
    areaAuto();

    // Configurar el selector de modelo antes del mensaje inicial
    const modelSelector = document.getElementById('model-selector');
    const statusText = document.querySelector('.text-blue-400') || document.querySelector('.text-green-400');

    // Añadir opción de imagen al selector
    if (modelSelector && !modelSelector.querySelector('option[value="image"]')) {
        const imageOption = document.createElement('option');
        imageOption.value = 'image';
        imageOption.textContent = 'Generador de Imágenes';
        modelSelector.appendChild(imageOption);
    }

    // Establecer Llama como modelo inicial
    modelSelector.value = 'llama';

    // Guardar el modelo actual en el atributo de datos
    statusText.setAttribute('data-current-model', 'llama');

    // Añadir mensaje inicial del bot
    const initialMessage = "¡Hola! Soy el asistente virtual de Diego. Puedo responder preguntas sobre su experiencia, proyectos y habilidades en desarrollo frontend. También puedo generar imágenes con el comando /imagen seguido de una descripción.";
    addMessage("bot", initialMessage);

    // Configurar el evento de cambio del selector de modelo
    modelSelector.addEventListener('change', updateModelStatus);

    // Configurar el tooltip
    setupTooltip();
});
// Función para actualizar el estado del modelo en la interfaz
function updateModelStatus() {
    const modelSelector = document.getElementById('model-selector');
    const selectedModel = modelSelector.value === 'image' ? 'replicate' : modelSelector.value;
    const statusText = document.querySelector('.text-green-400') || document.querySelector('.text-blue-400') || document.querySelector('.text-purple-400');
    const previousModel = statusText.getAttribute('data-current-model') || 'llama';

    // Actualizar el indicador visual
    if (selectedModel === 'llama') {
        statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> Usando Llama 3';
        statusText.className = 'text-blue-400 text-xs flex items-center gap-1';
    } else if (selectedModel === 'replicate') {
        statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-purple-400 inline-block"></span> Generador de Imágenes';
        statusText.className = 'text-purple-400 text-xs flex items-center gap-1';
    }

    // Guardar el modelo actual
    statusText.setAttribute('data-current-model', selectedModel);

    // Si el modelo ha cambiado, añadir un mensaje del sistema
    if (previousModel !== selectedModel && previousModel) {
        let modelName = 'Llama 3';
        let modelMessage = '¿En qué puedo ayudarte?';

        if (selectedModel === 'replicate') {
            modelName = 'Generador de Imágenes';
            modelMessage = 'Ahora puedes pedirme que genere imágenes. Escribe una descripción detallada de lo que quieres ver o usa el comando /imagen seguido de tu descripción.';
        }

        addMessage("bot", `Has cambiado al modelo ${modelName}. ${modelMessage}`);
    }
}


// Función para configurar el comportamiento del tooltip
function setupTooltip() {
    const tooltipContainer = document.querySelector('.tooltip');
    const tooltipText = document.querySelector('.tooltip-text');

    if (tooltipContainer && tooltipText) {
        tooltipContainer.addEventListener('mouseenter', () => {
            tooltipText.classList.remove('hidden');
        });

        tooltipContainer.addEventListener('mouseleave', () => {
            tooltipText.classList.add('hidden');
        });
    }
}