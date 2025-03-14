import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import LlamaAI from 'llamaai';

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Variables de entorno y configuración
const PORT = process.env.PORT || 3000;
const DEEPSEEK_API_KEY = process.env.OPENAI_API_KEY || 'sk-eb84e6b408164943bae95df877b0685b';
const LLAMA_API_KEY = process.env.LLAMA_API_KEY || '39de9221-82d9-4052-b6d3-433f54b3f4fd';

// Inicialización de Express
const app = express();
app.use(express.json());

// Servir archivos estáticos con ambas rutas
// Ruta con '/static' para compatibilidad con Vercel
app.use('/static', express.static(path.join(__dirname, 'static')));
// Ruta sin prefijo para desarrollo local
app.use(express.static(path.join(__dirname, 'static')));

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
Interés en el desarrollo de aplicaciones inteligentes y chatbots.
Experiencia Laboral de Diego:

Técnico Informático en CasanovaFoto:*
Brindó soporte técnico y soluciones informáticas a clientes y empleados.
Resolvió problemas de hardware y software.
Game Master en Resident Riddle:*
Creó experiencias de juego inmersivas y emocionantes para los participantes.
Desarrolló habilidades de comunicación y liderazgo.
Azafato de Eventos en Fotoforum Fest:*
Interactuó con el público y promovió eventos relacionados con la fotografía.
Ganó experiencia en atención al cliente y relaciones públicas.
Intereses Personales de Diego:

Comida Favorita: Los panqueques.
Libro Favorito: "Lagrimas de shiva".
Película Favorita: "La La Land".
Pasatiempos:*
Escuchar Musica.
Soy fan de la aereonautica, me encantan los aviones.
Aprender nuevas tecnologias, actualmente react y javascript.
Explorar nuevas tecnologías y herramientas de desarrollo.
Datos Personales y de contacto de Diego:

Edad: 18 años.
Nacionalidad: Española.
Correo Electrónico: tovard799@gmail.com
Teléfono: 640844225
DNI: 04333888K

tengo novia? si.

como te cree? a base de la documentacion oficial,

como me va en el insti? bien.

Instrucciones para el Chatbot:

SIEMPRE responderás al usuario de manera amigable y servicial.
Utilizarás un lenguaje claro y conciso para comunicarte con el usuario.
Adaptarás tus respuestas al contexto de la conversación y a las preguntas del usuario.
En caso de no conocer la respuesta a una pregunta, lo indicarás de manera honesta.
Si el usuario te habla de algo que no tenga relación con el desarrollo web o con Diego, se lo comunicarás pero le indicarás que aun así le darás una respuesta.
si deseas ponerte en contacto con Diego por motivos profesionales o relacionados con su trabajo, puedo ofrecerte algunas alternativas:

Puedes contactarlo a través de su correo electrónico profesional: [tovard799@gmail.com].
Puedes contactarlo a traves de su telefono:[+34 640 844 225]
Puedes enviarle un mensaje a través de LinkedIn: [https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/].
Si tu interés está relacionado con alguno de sus proyectos o habilidades específicas, puedo transmitirte la información necesaria para que puedas contactarlo de la forma más adecuada.
TIENES QUE SER CLARO Y CONSISO, NO PUEDES ENVIAR MENSAJES LARGOS, SIEMPRE INTENTA MAXIMO 1 PARRAFO
`;

// Configuración de CORS para todas las rutas
const setCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res;
};

// Middleware global para CORS
app.use((req, res, next) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// Ruta dinámica para páginas de proyectos
app.get('/proyecto-:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'proyecto.html'));
});

// Ruta específica para archivos estáticos que podrían no ser manejados correctamente por el middleware
app.get('/:file', (req, res, next) => {
    const file = req.params.file;
    // Si el archivo existe en la carpeta static, lo servimos
    const filePath = path.join(__dirname, 'static', file);
    try {
        if (path.extname(file)) { // Si tiene extensión, probablemente es un archivo estático
            return res.sendFile(filePath);
        }
    } catch (error) {
        // Si hay un error, continuamos con la siguiente ruta
    }
    next();
});

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

// Endpoint del chat unificado
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const model = req.body.model || 'deepseek'; // 'deepseek' o 'llama'

    if (!userMessage) {
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
            botResponse = await handleLlamaRequest(userMessage, controller);
        } else {
            // Valor por defecto: DeepSeek
            botResponse = await handleDeepSeekRequest(userMessage, controller);
        }

        clearTimeout(timeoutId);
        
        return res.status(200).json({ response: botResponse });

    } catch (error) {
        console.error(`Error en la API de ${req.body.model || 'deepseek'}:`, error);
        
        // Manejo específico de errores
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "La solicitud tomó demasiado tiempo en responder." });
        }

        let errorMessage = "Error al comunicarse con el chatbot.";
        if (req.body.model === 'llama') {
            errorMessage = "Error al comunicarse con el modelo Llama. Puede intentar con DeepSeek.";
        }

        return res.status(500).json({
            error: errorMessage,
            details: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor unificado ejecutándose en http://localhost:${PORT}`);
    console.log('Soporta modelos: DeepSeek y Llama');
});
