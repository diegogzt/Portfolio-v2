import OpenAI from 'openai';

// Configuración de la API de DeepSeek
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.OPENAI_API_KEY || 'sk-eb84e6b408164943bae95df877b0685b',
});

// Contexto personalizado (reducido para mostrar la estructura)
const customContext = `
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

Comida Favorita: La paella de marisco.
Libro Favorito: "El Señor de los Anillos" de J.R.R. Tolkien.
Película Favorita: "La La Land".
Pasatiempos:*
Jugar videojuegos.
Leer novelas de ciencia ficción y fantasía.
Ver series y películas de diversos géneros.
Explorar nuevas tecnologías y herramientas de desarrollo.
Datos Personales y de contacto de Diego:

Edad: 18 años.
Nacionalidad: Española.
Correo Electrónico: tovard799@gmail.com
Teléfono: 640844225
DNI: 04333888K


Instrucciones para el Chatbot:

SIEMPRE responderás al usuario de manera amigable y servicial.
Mencionarás a Diego en el primer mensaje como el creador del chatbot.
Utilizarás un lenguaje claro y conciso para comunicarte con el usuario.
Adaptarás tus respuestas al contexto de la conversación y a las preguntas del usuario.
En caso de no conocer la respuesta a una pregunta, lo indicarás de manera honesta.
Si el usuario te habla de algo que no tenga relación con el desarrollo web o con Diego, se lo comunicarás pero le indicarás que aun así le darás una respuesta.
si deseas ponerte en contacto con Diego por motivos profesionales o relacionados con su trabajo, puedo ofrecerte algunas alternativas:

Puedes contactarlo a través de su correo electrónico profesional: [tovard799@gmail.com].
Puedes contactarlo a traves de su telefono:[+34 640 844 225]
Puedes enviarle un mensaje a través de LinkedIn: [https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/].
Si tu interés está relacionado con alguno de sus proyectos o habilidades específicas, puedo transmitirte la información necesaria para que puedas contactarlo de la forma más adecuada.
`;

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS method for preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Mensaje del usuario no proporcionado." });
    }

    try {
        // Add timeout to the OpenAI request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout

        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: customContext },
                { role: "user", content: userMessage },
            ],
            stream: false,
            max_tokens: 500, // Limit token count to speed up response
            temperature: 0.7 // Lower temperature for more focused responses
        }, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const botResponse = response.choices[0].message.content;
        res.status(200).json({ response: botResponse });

    } catch (error) {
        console.error("Error al llamar a la API de DeepSeek:", error);

        // More specific error messages
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "La solicitud a DeepSeek tomó demasiado tiempo en responder." });
        }

        if (error.response) {
            return res.status(error.response.status || 500).json({
                error: `Error de la API: ${error.response.statusText || 'Unknown error'}`,
                details: error.message
            });
        }

        res.status(500).json({
            error: "Error al comunicarse con el chatbot.",
            details: error.message
        });
    }
}