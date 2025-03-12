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
    div.className = `message ${role}`;
    if (role == "bot") {
        div.className = `chati`;
        message = message.replace(/\*\*/g, '<br>');
        message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: blue;" target="_blank">$1</a>');
        div.innerHTML = message;
    } else {
        div.textContent = message;
    }

    div.style.maxWidth = '510px';
    div.style.marginLeft = '20px';

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

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

// Agregar una variable global para rastrear si es el primer intento
let isFirstAttempt = true;

async function sendMessage(retryCount = 0) {
    const message = userInput.value.trim();
    if (!message && retryCount === 0) return; // Solo verificar si está vacío en el primer intento

    // Only add user message on first attempt, not on retries
    if (retryCount === 0) {
        addMessage("user", message);
        userInput.value = "";
    }

    userInput.disabled = true;
    sendButton.disabled = true;

    const loadingMessage = addLoadingMessage();

    // Set a local retry flag
    isRetrying = retryCount > 0;

    // Obtener el modelo seleccionado
    const modelSelector = document.getElementById('model-selector');
    const selectedModel = modelSelector.value;
    
    try {
        // Obtener la URL base
        const baseUrl = window.location.origin;
        
        console.log(`Enviando solicitud a ${baseUrl}/chat con modelo: ${selectedModel}`);
        
        // Use a timeout promise to allow aborting long requests
        const fetchPromise = fetch(`${baseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message,
                model: selectedModel  // Enviar el modelo seleccionado
            })
        });

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 30000); // Aumentar a 30 segundos para dar más tiempo
        });

        // Race the fetch against the timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Error HTTP: ${response.status}` }));
            throw new Error(errorData.error || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (chatBody.contains(loadingMessage)) {
            chatBody.removeChild(loadingMessage);
        }

        if (data.response) {
            addMessage("bot", data.response);
            // Si el primer intento tuvo éxito, marcar como completado
            if (isFirstAttempt) {
                isFirstAttempt = false;
            }
        } else {
            addMessage("bot", "Lo siento, ocurrió un error en la respuesta.");
        }

        // Reset retry flag
        isRetrying = false;

    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        
        if (chatBody.contains(loadingMessage)) {
            chatBody.removeChild(loadingMessage);
        }

        // Obtener el modelo actualmente seleccionado para mensajes específicos
        const modelSelector = document.getElementById('model-selector');
        const selectedModel = modelSelector.value;
        const modelName = selectedModel === 'llama' ? 'Llama 3' : 'DeepSeek';

        // Implement retry logic
        if (retryCount < 2) {  // Try up to 2 additional times
            console.log(`Reintentando envío de mensaje (${retryCount + 1}/3)`);
            addMessage("bot", `Estoy teniendo problemas para conectar con el servidor de ${modelName}. Intentando nuevamente... (${retryCount + 1}/3)`);
            setTimeout(() => sendMessage(retryCount + 1), 2000);  // Wait 2 seconds before retrying
        } else {
            // If all retries failed, show a fallback message
            console.log("Todos los reintentos fallaron. Mostrando mensaje alternativo.");
            let fallbackResponse = `Lo siento, parece que estoy teniendo dificultades para conectarme al servidor de ${modelName} en este momento.`;
            
            if (selectedModel === 'llama') {
                fallbackResponse += `\n\nPuedes probar a cambiar al modelo DeepSeek desde el selector en la parte superior del chat. Es posible que el servidor de Llama 3 no esté activo en este momento.`;
            } else {
                fallbackResponse += `\n\nPuedes probar a cambiar al modelo Llama 3 desde el selector en la parte superior del chat. Es posible que el servidor principal no esté activo en este momento.`;
            }
            
            fallbackResponse += `\n\nPuedes contactar con Diego directamente:
- Email: tovard799@gmail.com
- Teléfono: +34 640 844 225
- LinkedIn: https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/`;

            addMessage("bot", fallbackResponse);
            isRetrying = false;
            // Marcar el primer intento como completado incluso si falló
            if (isFirstAttempt) {
                isFirstAttempt = false;
            }
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

// Initialize the auto-sizing textarea when the page loads
document.addEventListener('DOMContentLoaded', function() {
    areaAuto();
    
    // Configurar el selector de modelo y asegurarse de que Llama esté seleccionado
    const modelSelector = document.getElementById('model-selector');
    if (modelSelector) {
        // Establecer Llama como valor por defecto si no está ya seleccionado
        if (modelSelector.value !== 'llama') {
            modelSelector.value = 'llama';
        }
        
        // Configurar el evento de cambio
        modelSelector.addEventListener('change', updateModelStatus);
        
        // Actualizar el estado inicial
        updateModelStatus();
    }
    
    // Añadir mensaje inicial del bot (Llama 3 por defecto)
    const initialMessage = "¡Hola! Soy el asistente virtual de Diego usando el modelo Llama 3. Puedo responder preguntas sobre su experiencia, proyectos y habilidades en desarrollo. ¿En qué puedo ayudarte hoy?";
    addMessage("bot", initialMessage);
    
    // Configurar el tooltip
    setupTooltip();
});

// Función para actualizar el estado del modelo en la interfaz
function updateModelStatus() {
    const modelSelector = document.getElementById('model-selector');
    const selectedModel = modelSelector.value;
    const statusText = document.querySelector('.text-green-400') || document.querySelector('.text-blue-400');
    
    if (!statusText) return; // Salir si no se encuentra el elemento
    
    const previousModel = statusText.getAttribute('data-current-model') || 'llama'; // Cambiar el valor por defecto a 'llama'
    
    // Actualizar el indicador visual
    if (selectedModel === 'llama') {
        statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> Usando Llama 3';
        statusText.className = 'text-blue-400 text-xs flex items-center gap-1';
    } else {
        statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Usando DeepSeek';
        statusText.className = 'text-green-400 text-xs flex items-center gap-1';
    }
    
    // Guardar el modelo actual
    statusText.setAttribute('data-current-model', selectedModel);
    
    // Si el modelo ha cambiado, añadir un mensaje del sistema
    if (previousModel !== selectedModel && previousModel) {
        const modelName = selectedModel === 'llama' ? 'Llama 3' : 'DeepSeek';
        addMessage("bot", `Has cambiado al modelo ${modelName}. ¿En qué puedo ayudarte?`);
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