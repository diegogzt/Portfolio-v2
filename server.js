import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import LlamaAI from 'llamaai';
import Replicate from 'replicate';

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Variables de entorno y configuración
const PORT = process.env.PORT || 3000;
const LLAMA_API_KEY = process.env.LLAMA_API_KEY || '39de9221-82d9-4052-b6d3-433f54b3f4fd';
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || 'r8_FPuZHxl484BZ0QcmGUQG9U5qerv8O891t2VKm';

// Inicialización de Express
const app = express();
app.use(express.json());

// Servir archivos estáticos con ambas rutas
// Ruta con '/static' para compatibilidad con Vercel
app.use('/static', express.static(path.join(__dirname, 'static')));
// Ruta sin prefijo para desarrollo local
app.use(express.static(path.join(__dirname, 'static')));

// Configuración del cliente Llama
const llamaAPI = new LlamaAI(LLAMA_API_KEY);

// Inicializar el cliente de Replicate
const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
});

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

tengo novia? si, se llama Xenia

como te cree? a base de la documentacion oficial,

como me va en el insti? bien.

Instrucciones para el Chatbot:

SIEMPRE responderás al usuario de manera amigable y servicial.
Utilizarás un lenguaje claro y conciso para comunicarte con el usuario.
En caso de no conocer la respuesta a una pregunta, lo indicarás de manera honesta.
Si el usuario te habla de algo que no tenga relación con el desarrollo web o con Diego, se lo comunicarás pero le indicarás que aun así le darás una respuesta.
si deseas ponerte en contacto con Diego por motivos profesionales o relacionados con su trabajo, puedo ofrecerte algunas alternativas:

Puedes contactarlo a través de su correo electrónico profesional: [tovard799@gmail.com].
Puedes contactarlo a traves de su telefono:[+34 640 844 225]
Puedes enviarle un mensaje a través de LinkedIn: [https://www.linkedin.com/in/dgtovar/].
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
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, o-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

<<<<<<< Updated upstream
// Endpoint del chat unificado
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
<<<<<<< HEAD
    const model = req.body.model || 'deepseek'; // 'deepseek', 'llama' o 'image'
=======
    const model = req.body.model || 'deepseek'; // 'deepseek' o 'llama'
=======
// Función actualizada para generar imágenes con Replicate con resolución específica
async function generateImage(prompt) {
    try {
        console.log('Generando imagen con prompt:', prompt);

        // Usamos el modelo Flux Schnell de Replicate con tamaño personalizado
        const [output] = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    width: 437,    // Ancho personalizado
                    height: 437    // Altura personalizada
                },
            }
        );

        console.log('Imagen generada:', output);
        return output; // URL de la imagen generada
    } catch (error) {
        console.error('Error al generar imagen:', error);
        throw error;
    }
}

// Endpoint unificado del chat
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const model = req.body.model || 'llama'; // 'llama' o 'replicate'
>>>>>>> Stashed changes
<<<<<<< HEAD
>>>>>>> 74834b5 (agregar generacion de imagenes)
=======
>>>>>>> main

    if (!userMessage) {
        return res.status(400).json({ error: "Mensaje del usuario no proporcionado." });
    }

    try {
<<<<<<< Updated upstream
        // Configuración del timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

        let botResponse;

        if (model === 'llama') {
            botResponse = await handleLlamaRequest(userMessage, controller);
        } else if (model === 'deepseek') {
            botResponse = await handleDeepSeekRequest(userMessage, controller);
        } else {
            // ...existing code for image generation...
        }

        clearTimeout(timeoutId);

        return res.status(200).json({ response: botResponse });

    } catch (error) {
        console.error(`Error en la API de ${model}:`, error);

        // Manejo específico de errores
=======
        let botResponse;

        // Detectar si es una solicitud de generación de imagen
        const isImageRequest =
            userMessage.toLowerCase().startsWith("/imagen ") ||
            userMessage.toLowerCase().startsWith("/image ") ||
            userMessage.toLowerCase().startsWith("/generar ");

        if (isImageRequest) {
            // Extraer el prompt para la imagen
            const imagePrompt = userMessage.substring(userMessage.indexOf(' ') + 1).trim();

            console.log(`Generando imagen con Replicate...`);
            try {
                const imageUrl = await generateImage(imagePrompt);
                botResponse = `¡He generado esta imagen para ti! [IMAGE_URL:${imageUrl}]`;
            } catch (error) {
                console.error('Error generando imagen con Replicate:', error);
                botResponse = `Lo siento, hubo un problema al generar la imagen: ${error.message}`;
            }
        } else {
            // Procesar solicitudes normales de texto con Llama
            botResponse = await handleLlamaRequest(userMessage, new AbortController());
        }

        return res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error(`Error en el endpoint de chat:`, error);

>>>>>>> Stashed changes
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "La solicitud tomó demasiado tiempo en responder." });
        }

<<<<<<< HEAD
<<<<<<< HEAD
        if (error.status === 402 && error.error?.message === 'Insufficient Balance') {
            return res.status(402).json({
                error: "Saldo insuficiente para realizar esta operación. Por favor, recarga tu cuenta o contacta al administrador."
            });
        }

        return res.status(500).json({
            error: "Error al procesar la solicitud.",
=======
=======
>>>>>>> main
<<<<<<< Updated upstream
        let errorMessage = "Error al comunicarse con el chatbot.";
        if (req.body.model === 'llama') {
            errorMessage = "Error al comunicarse con el modelo Llama. Puede intentar con DeepSeek.";
        }

        return res.status(500).json({
            error: errorMessage,
=======
        return res.status(500).json({
            error: "Error al procesar la solicitud.",
            details: error.message
        });
    }
});

// Endpoint para generar imágenes directamente
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Se requiere un prompt para generar la imagen." });
    }

    try {
        const imageUrl = await generateImage(prompt);
        return res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error en el endpoint de generación de imágenes:', error);
        return res.status(500).json({
            error: "Error al generar la imagen.",
>>>>>>> Stashed changes
<<<<<<< HEAD
>>>>>>> 74834b5 (agregar generacion de imagenes)
=======
>>>>>>> main
            details: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor unificado ejecutándose en http://localhost:${PORT}`);
<<<<<<< Updated upstream
    console.log('Soporta modelos: DeepSeek y Llama');
});



<<<<<<< HEAD
<<<<<<< HEAD
// Importaciones para Replicate
import Replicate from 'replicate';

// Añadir esta constante con tu token de Replicate
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || 'r8_GypGAnYey2S54FSfwZB5Xs5uvD2krlh2XWNNt';

// Inicializar el cliente de Replicate
const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
});

// Función para generar imágenes con Replicate
async function generateImage(prompt) {
    try {
        console.log('Generando imagen con prompt:', prompt);

        // Usamos el modelo Flux Schnell de Replicate
        const [output] = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                },
            }
        );

        console.log('Imagen generada:', output);
        return output; // URL de la imagen generada
    } catch (error) {
        console.error('Error al generar imagen:', error);
        throw error;
    }
}

// Endpoint para generar imágenes
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Se requiere un prompt para generar la imagen." });
    }

    try {
        const imageUrl = await generateImage(prompt);
        return res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error en el endpoint de generación de imágenes:', error);
        return res.status(500).json({
            error: "Error al generar la imagen.",
            details: error.message
        });
    }
});

// Modificar el endpoint de chat para integrar la generación de imágenes con Replicate
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Mensaje del usuario no proporcionado." });
    }

    try {
        let botResponse;

        // Detectar si es una solicitud de generación de imagen
        const isImageRequest =
            userMessage.toLowerCase().startsWith("/imagen ") ||
            userMessage.toLowerCase().startsWith("/image ") ||
            userMessage.toLowerCase().startsWith("/generar ");

        if (isImageRequest) {
            // Extraer el prompt para la imagen
            const imagePrompt = userMessage.substring(userMessage.indexOf(' ') + 1).trim();

            console.log("Generando imagen con Replicate...");
            const imageUrl = await generateImage(imagePrompt);

            botResponse = `¡He generado esta imagen para ti! [IMAGE_URL:${imageUrl}]`;
        } else {
            botResponse = "Lo siento, no entiendo tu solicitud. Por favor, intenta con un comando válido.";
        }

        return res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error("Error en el endpoint de chat:", error);
        return res.status(500).json({
            error: "Error al procesar la solicitud.",
            details: error.message
        });
    }
});
=======
=======
>>>>>>> main
=======
    console.log('Soporta modelos: Llama y Replicate');
});
>>>>>>> Stashed changes
<<<<<<< HEAD
>>>>>>> 74834b5 (agregar generacion de imagenes)
=======
>>>>>>> main
