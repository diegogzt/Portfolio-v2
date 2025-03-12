import OpenAI from 'openai';
import LlamaAI from 'llamaai';

// Variables de entorno y configuración
const DEEPSEEK_API_KEY = process.env.OPENAI_API_KEY || 'sk-eb84e6b408164943bae95df877b0685b';
const LLAMA_API_KEY = process.env.LLAMA_API_KEY || '39de9221-82d9-4052-b6d3-433f54b3f4fd';

// Configuración del cliente OpenAI para DeepSeek
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: DEEPSEEK_API_KEY
});

// Configuración del cliente Llama
const llamaAPI = new LlamaAI(LLAMA_API_KEY);

// Contexto del chatbot
const CUSTOM_CONTEXT = `
Contexto del Chatbot:

¡Hola! Soy un chatbot creado por Diego, un apasionado desarrollador web de 18 años que reside en la vibrante ciudad de Barcelona, en el barrio 22@, y que actualmente se encuentra formándose en el instituto ITIC. Diego es un entusiasta del mundo de la tecnología y el desarrollo, con un abanico de habilidades que abarcan desde el diseño frontend hasta la inteligencia artificial.

Habilidades de Diego:

Lenguajes de Programación:*
HTML
CSS
Java
JavaScript
Python
Desarrollo Web:*
Experiencia en la creación de interfaces de usuario atractivas y funcionales.
Conocimientos en frameworks y librerías modernas.
Inteligencia Artificial:*
Exploración y experimentación con modelos de lenguaje como DeepSeek.
`;

// Función para manejar la solicitud a DeepSeek
async function handleDeepSeekRequest(userMessage, controller) {
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: CUSTOM_CONTEXT },
            { role: "user", content: userMessage },
        ],
        stream: false,
        max_tokens: 500,
        temperature: 0.7
    }, {
        signal: controller.signal
    });

    return response.choices[0].message.content;
}

// Función para manejar la solicitud a Llama
async function handleLlamaRequest(userMessage, controller) {
    // Configurar la solicitud según la documentación de Llama
    const apiRequestJson = {
        model: "llama3-8b",
        messages: [
            { role: "system", content: CUSTOM_CONTEXT },
            { role: "user", content: userMessage }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 500
    };

    // Utilizamos un AbortController para manejar el timeout
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 30000);

    try {
        const response = await llamaAPI.run(apiRequestJson, {
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        console.log('Respuesta de Llama API:', JSON.stringify(response, null, 2));
        
        // Procesar la respuesta según el formato de Llama
        if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            return response.choices[0].message.content;
        } else if (response.content) {
            return response.content;
        } else {
            return JSON.stringify(response);
        }
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

// Handler principal para Vercel Serverless Function
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejar solicitudes OPTIONS para preflight CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Solo permitir solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { message, model } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensaje del usuario no proporcionado." });
    }

    try {
        // Configuración del timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

        let botResponse;

        // Seleccionar el modelo a utilizar
        console.log(`Usando modelo: ${model}`);
        if (model === 'llama') {
            botResponse = await handleLlamaRequest(message, controller);
        } else {
            // Valor por defecto: DeepSeek
            botResponse = await handleDeepSeekRequest(message, controller);
        }

        // Limpiar el timeout
        clearTimeout(timeoutId);

        // Retornar la respuesta
        return res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        
        // Manejar diferentes tipos de errores
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "La solicitud tardó demasiado tiempo en completarse." });
        } else if (error.response) {
            // Error de la API
            return res.status(error.response.status || 500).json({ 
                error: `Error en la API: ${error.response.statusText || error.message}` 
            });
        } else {
            // Error general
            return res.status(500).json({ error: `Error al procesar la solicitud: ${error.message}` });
        }
    }
} 