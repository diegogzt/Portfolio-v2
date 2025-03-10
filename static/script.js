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

async function sendMessage(retryCount = 0) {
    const message = userInput.value.trim();
    if (!message) return;

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

    try {
        // Use a timeout promise to allow aborting long requests
        const fetchPromise = fetch('/api/chat', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), 25000);
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
        } else {
            addMessage("bot", "Lo siento, ocurrió un error en la respuesta.");
        }

        // Reset retry flag
        isRetrying = false;

    } catch (error) {
        console.error("Error:", error);
        chatBody.removeChild(loadingMessage);

        // Implement retry logic
        if (retryCount < 2) {  // Try up to 2 additional times
            addMessage("bot", `Estoy teniendo problemas para conectar. Intentando nuevamente... (${retryCount + 1}/3)`);
            setTimeout(() => sendMessage(retryCount + 1), 2000);  // Wait 2 seconds before retrying
        } else {
            // If all retries failed, show a fallback message
            const fallbackResponse = `Lo siento, parece que estoy teniendo dificultades para conectarme al servidor en este momento. 

Mientras tanto, puedo decirte que soy un chatbot creado por Diego, un desarrollador web de 18 años de Barcelona. 

Si deseas contactar con Diego directamente:
- Email: tovard799@gmail.com
- Teléfono: +34 640 844 225
- LinkedIn: https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/

¿Puedo ayudarte con algo más mientras resolvemos los problemas técnicos?`;

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

// Initialize the auto-sizing textarea when the page loads
document.addEventListener('DOMContentLoaded', function() {
    areaAuto();
    
    // Añadir mensaje inicial del bot
    const initialMessage = "¡Hola! Soy el asistente virtual de Diego. Puedo responder preguntas sobre su experiencia, proyectos y habilidades en desarrollo frontend. ¿En qué puedo ayudarte hoy?";
    addMessage("bot", initialMessage);
});