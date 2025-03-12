# Chatbot de Diego - Portfolio v2

Este proyecto implementa un chatbot personalizado para el portafolio de Diego, utilizando diferentes modelos de IA.

## Características

- Chatbot interactivo que responde preguntas sobre Diego y sus habilidades
- Integración con dos APIs diferentes: DeepSeek y Llama AI
- Interfaz web moderna y responsiva
- Manejo de errores y tiempos de espera
- Configuración CORS para integrarse con cualquier frontend

## Requisitos

- Node.js 14+
- npm o yarn

## Instalación

1. Clona este repositorio:
```
git clone https://github.com/diegogzt/Portfolio-v2.git
cd Portfolio-v2
```

2. Instala las dependencias:
```
npm install
```

3. Configura las variables de entorno (copia el archivo .env.example a .env y edítalo):
```
OPENAI_API_KEY=tu_clave_de_api_de_deepseek
LLAMA_API_KEY=tu_clave_de_api_de_llama
PORT=3000
```

## Uso

### Servidor con DeepSeek AI

Para iniciar el servidor que utiliza la API de DeepSeek:

```
npm run start:deepseek
```

El servidor estará disponible en `http://localhost:3000`.

### Servidor con Llama AI

Para iniciar el servidor que utiliza la API de Llama:

```
npm run start:llama
```

El servidor estará disponible en `http://localhost:3001`.

## Endpoints

### GET /

Sirve la página principal del portafolio.

### POST /chat

Endpoint para interactuar con el chatbot.

**Petición:**
```json
{
  "message": "¿Cuáles son las habilidades de Diego?"
}
```

**Respuesta:**
```json
{
  "response": "Diego es un desarrollador web con habilidades en HTML, CSS, JavaScript, Java y Python. También tiene experiencia en el desarrollo de interfaces de usuario y está explorando la inteligencia artificial."
}
```

## Estructura del Proyecto

- `server.js`: Servidor principal usando DeepSeek
- `server-llama.js`: Servidor alternativo usando Llama AI
- `static/`: Archivos estáticos (HTML, CSS, JS)
- `.env`: Variables de entorno (no incluido en el repositorio)

## Contribuir

Si deseas contribuir a este proyecto, por favor contacta a Diego a través de:
- Email: tovard799@gmail.com
- LinkedIn: https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/
