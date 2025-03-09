import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path'; // Importa el módulo 'path' de Node.js
import { fileURLToPath } from 'url'; // <-- ¡NUEVA IMPORTACIÓN!

// **DEFINE __dirname HERE, IMMEDIATELY AFTER IMPORTS:**
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

// **NOW you can use __dirname here, AFTER it's been defined:**
app.use('/static', express.static(path.join(__dirname, 'static')));


// Configuración de la API de DeepSeek
const apiKeyDeepSeek = process.env.OPENAI_API_KEY; // Use fallback directly for testing
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-eb84e6b408164943bae95df877b0685b',
});



// Contexto personalizado (igual que en Python)
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
`; // **¡PEGA AQUÍ TU CONTEXTO COMPLETO!**

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html')); // Ruta a index.html DENTRO de static - ¡MODIFICADO!
});
// Ruta /chat (similar a tu ruta en Flask)
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message; // Obtener el mensaje del usuario desde el cuerpo de la petición

    if (!userMessage) {
        return res.status(400).json({ error: "Mensaje del usuario no proporcionado." });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: customContext },
                { role: "user", content: userMessage },
            ],
            stream: false,
        });

        const botResponse = response.choices[0].message.content;
        res.json({ response: botResponse }); // Enviar la respuesta del bot como JSON

    } catch (error) {
        console.error("Error al llamar a la API de DeepSeek:", error);
        res.status(500).json({ error: "Error al comunicarse con el chatbot." }); // Enviar error al cliente
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
