# Portfolio de Diego Zaldivar con Chat IA Dual

![Estado](https://img.shields.io/badge/Estado-Activo-brightgreen)
![Despliegue](https://img.shields.io/badge/Despliegue-Vercel-blue)
![Versión](https://img.shields.io/badge/Versión-2.0-purple)

Portfolio web personal interactivo con integración de chat IA dual (Llama 3 y DeepSeek), presentando habilidades, proyectos y experiencia profesional.

[Ver demo en vivo](https://dgtovar.dev)

![Vista previa del portfolio](https://github.com/diegogzt/Portfolio-v2/raw/main/preview.png)

## 🌟 Características Principales

- 🎨 **Diseño Moderno**: Interfaz elegante con animaciones fluidas y diseño responsive
- 🤖 **Chat IA Dual**: Integración de dos modelos de IA (Llama 3 y DeepSeek)
- 📱 **Totalmente Responsive**: Experiencia optimizada en todos los dispositivos
- 🚀 **Despliegue en Vercel**: Configuración optimizada para el despliegue continuo
- 🔄 **Manejo Inteligente de Errores**: Sistema de reintentos automáticos en el chat

## 🛠️ Tecnologías

### Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- TailwindCSS
- Typed.js

### Backend
- Node.js
- Express.js
- APIs de IA:
  - Llama AI (`llamaai`)
  - DeepSeek (usando la biblioteca `openai`)

### Despliegue
- Vercel
- GitHub Actions para CI/CD

## 📋 Requisitos

- Node.js 14+
- npm o yarn
- Claves API para:
  - DeepSeek AI
  - Llama AI

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone https://github.com/diegogzt/Portfolio-v2.git
cd Portfolio-v2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
   - Copia `.env.example` a `.env` y configura:
```
OPENAI_API_KEY=tu_clave_de_api_de_deepseek
LLAMA_API_KEY=tu_clave_de_api_de_llama
PORT=3000
```

4. **Ejecutar en modo desarrollo**
```bash
npm run start
```

## 💻 Uso del Chat IA

El portfolio incluye un chat inteligente que permite a los visitantes interactuar y hacer preguntas sobre Diego, sus habilidades, proyectos y experiencia.

### Modelos disponibles:

1. **Llama 3 (predeterminado)**
   - Modelo de 8B parámetros
   - Respuestas más detalladas y naturales

2. **DeepSeek**
   - Modelo alternativo
   - Para cuando Llama no está disponible

Para cambiar entre modelos, simplemente usa el selector en la parte superior del chat.

## 🏗️ Estructura del Proyecto

```
Portfolio-v2/
├── server.js              # Servidor unificado
├── static/                # Archivos estáticos
│   ├── index.html         # Página principal
│   ├── script.js          # Lógica del chat
│   ├── style.css          # Estilos principales
│   ├── input.css          # Estilos de entrada
│   ├── output.css         # Estilos procesados
│   └── img/               # Imágenes de proyectos
├── vercel.json            # Configuración de despliegue
├── package.json           # Dependencias
└── README.md              # Documentación
```

## 📝 Documentación Adicional

Para una documentación más detallada del proyecto, consulta el archivo [documentacion.txt](./documentacion.txt) que incluye:
- Descripción completa de la arquitectura
- Guía detallada de mantenimiento
- Solución a problemas comunes
- Guía para añadir nuevos proyectos
- Explicación técnica del sistema de chat

## 🧩 APIs y Endpoints

### GET `/`
- Sirve la página principal del portfolio

### POST `/chat`
- Endpoint para interactuar con el chatbot
- Recibe: `{ "message": "tu pregunta", "model": "llama|deepseek" }`
- Devuelve: `{ "response": "respuesta del bot" }`

## 🐛 Solución de Problemas

Si encuentras problemas al ejecutar la aplicación:

1. Verifica que las claves API en `.env` son correctas
2. Asegúrate de haber instalado todas las dependencias
3. Comprueba la disponibilidad de las APIs externas
4. Revisa los logs del servidor para identificar errores específicos

## 📞 Contacto

Si tienes preguntas o quieres colaborar, contacta a Diego:

- **Email**: tovard799@gmail.com  
- **LinkedIn**: [Diego Gabriel Zaldivar Tovar](https://www.linkedin.com/in/diego-gabriel-zaldivar-tovar-473a9a252/)
- **Teléfono**: +34 640 844 225

## 📜 Licencia

Este proyecto está disponible como código abierto bajo la licencia MIT.
