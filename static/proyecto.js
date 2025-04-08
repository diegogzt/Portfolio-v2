// === SOLUCIÓN COMPLETA PARA PROBLEMAS DE CARGA ===
// Reemplaza todo tu código de proyecto.js con este código

// Variables globales
let projectId;
let allProjects = [
    {
        id: 1,
        title: 'Portfolio Personal',
        category: 'Aplicación Web',
        date: 'Marzo 2025',
        description: 'Un portfolio personal con un chatbot con API de llama y deepseek para que la empresa este dispuesta a contratarme.',
        technologies: ['Node.js', 'Javascript', 'Tailwind', 'CSS', 'HTML', 'Vercel', 'Cloudflare'],
        features: [
            'Chat en tiempo real con IA',
            'Paleta de colores oscuros',
            'Interfaz responsiva para todos los dispositivos',
            'Formulario de contacto funcional',
            'Pagina dinamica'
        ],
        demoUrl: 'index.html',
        githubUrl: 'https://github.com/diegogzt',
        gallery: [
            { url: 'img/portfolio.png', title: 'Interfaz principal' },
            { url: 'img/index-chat.png', title: 'Chat con IA' },
            { url: 'img/index-card.png', title: 'Seccion con Cartas' },
            { url: 'img/index-contacto.png', title: 'Formulario de contacto' },
            { url: 'img/index-footer.png', title: 'Footer atractivo' }
        ]
    },
    {
        id: 2,
        title: 'Tienda de NFT',
        category: 'Plataforma de Comercio',
        date: 'Abril 2025 (A falta del backend para la subida online)',
        // Corregido para incluir extensión .png
        image: 'img/pingu-market.png',
        description: 'Una plataforma de comercio electrónico completa con catálogo de productos, carrito de compras, pasarela de pagos y gestión de pedidos.',
        technologies: ['JavaScript', 'HTML', 'CSS'],
        features: [
            'Trabajo Freelance para un cliente',
            'Catálogo de productos con filtrado y búsqueda',
            'Insersión de productos mediante fichero JSON',
            'Pagina con Gameboy interactiva',
            'Diferente disposcición de mismos elementos'
        ],
        demoUrl: '404.html',
        githubUrl: '404.html',
        gallery: [
            { url: 'img/pingu-market.png', title: 'Página principal (Cliente cambiara texto)' },
            { url: 'img/articulos.png', title: 'Página de producto' },
            { url: 'img/more-productos.png', title: 'Diferente disposicion de productos' },
            { url: 'img/pingu-play.png', title: 'Pagina interactiva Gameboy' },
        ]
    },
    {
        id: 3,
        title: 'Página de reservas para Restaurantes',
        category: 'Landing Page y Reservas',
        date: 'Marzo 2025',
        image: 'img/np.png',
        description: 'Una página web diseñada para restaurantes que permite a los usuarios explorar el menú, realizar reservas en línea y obtener información sobre el lugar.',
        technologies: ['Node.js', 'JavaScript', 'Tailwind CSS', 'Cloudflare', 'HTML'],
        features: [
            'Sistema de reservas en línea',
            'Visualización del menú con imágenes',
            'Información del restaurante y ubicación',
            'Interfaz responsiva para dispositivos móviles',
            'Integración con APIs externas para datos en tiempo real'
        ],
        demoUrl: '404.html',
        githubUrl: '404.html',
        gallery: [
            { url: 'img/res-index.png', title: 'Página principal' },
            { url: 'img/rest-int.png', title: 'Visualización del menú' },
            { url: 'img/reserva.png', title: 'Sistema de reservas' },
            { url: 'img/menu.png', title: 'Menu de las comidas' },
        ]
    }
];

// === FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ===
// Esta función garantiza que todo se cargue en el orden correcto
function garantizarCargaCompleta() {
    console.log("Inicializando carga controlada...");

    // Verificar estado del DOM y actuar en consecuencia
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarTodo);
        console.log("DOM en carga, esperando evento DOMContentLoaded...");
    } else {
        console.log("DOM ya cargado, inicializando directamente...");
        inicializarTodo();
    }
}

// Función central que maneja toda la inicialización
function inicializarTodo() {
    console.log("DOM listo, iniciando carga de proyecto...");

    // Verificar si GSAP está disponible
    const gsapDisponible = typeof gsap !== 'undefined';
    if (!gsapDisponible) {
        console.warn("GSAP no está disponible. Las animaciones estarán desactivadas.");
    }

    // Dar un pequeño tiempo para que todo se asiente
    setTimeout(() => {
        cargarProyecto();
    }, 200);
}

// Función para obtener el ID del proyecto de la URL
function getProjectIdFromUrl() {
    const urlPath = window.location.pathname;
    const match = urlPath.match(/proyecto-(\d+)/);
    const id = match ? match[1] : '1'; // Por defecto, mostrar el proyecto 1
    console.log(`ID de proyecto detectado: ${id}`);
    return id;
}

// === CARGA PRINCIPAL DEL PROYECTO ===
function cargarProyecto() {
    try {
        // Obtener ID y buscar proyecto
        projectId = getProjectIdFromUrl();
        const currentProject = allProjects.find(project => project.id == projectId);

        if (!currentProject) {
            console.error(`Proyecto no encontrado con ID: ${projectId}`);
            mostrarError("Proyecto no encontrado");
            return;
        }

        // Verificar que existan los contenedores necesarios
        const contenedoresRequeridos = [
            'project-title',
            'project-category',
            'project-date',
            'project-description',
            'project-technologies',
            'project-features',
            'gallery',
            'other-projects'
        ];

        let contenedoresFaltantes = [];
        contenedoresRequeridos.forEach(id => {
            if (!document.getElementById(id)) {
                contenedoresFaltantes.push(id);
            }
        });

        if (contenedoresFaltantes.length > 0) {
            console.error("Contenedores faltantes:", contenedoresFaltantes);
            mostrarError("Estructura HTML incompleta. Faltan elementos necesarios.");
            return;
        }

        // Ahora sí, cargar todo el contenido en orden
        console.log("Actualizando información del proyecto...");
        updateProjectContent(currentProject);

        console.log("Cargando galería de imágenes...");
        cargarGaleriaSinFallos(currentProject.gallery);

        console.log("Cargando otros proyectos...");
        cargarProyectosRelacionados(currentProject.id);

        if (typeof gsap !== 'undefined') {
            console.log("Iniciando animaciones...");
            initAnimations();
        }

        // Mostrar indicador de éxito
        console.log("Proyecto cargado correctamente:", currentProject.title);
        mostrarNotificacion(`Proyecto "${currentProject.title}" cargado correctamente`);

    } catch (error) {
        console.error("Error general al cargar el proyecto:", error);
        mostrarError("Error al cargar el proyecto");
    }
}

// === FUNCIONES MEJORADAS PARA ACTUALIZAR CONTENIDO ===

// Actualizar el contenido de la página con los datos del proyecto
function updateProjectContent(project) {
    try {
        // Actualizar la cabecera con verificación
        const elementos = {
            title: document.getElementById('project-title'),
            category: document.getElementById('project-category'),
            date: document.getElementById('project-date'),
            description: document.getElementById('project-description'),
            demoLink: document.getElementById('project-demo'),
            githubLink: document.getElementById('project-github')
        };

        // Actualizar textos con verificación previa
        if (elementos.title) elementos.title.textContent = project.title;
        if (elementos.category) elementos.category.textContent = project.category;
        if (elementos.date) elementos.date.textContent = project.date;
        if (elementos.description) elementos.description.textContent = project.description;

        // Actualizar enlaces con verificación previa
        if (elementos.demoLink) elementos.demoLink.href = project.demoUrl;
        if (elementos.githubLink) elementos.githubLink.href = project.githubUrl;

        // Actualizar tecnologías
        actualizarTecnologias(project.technologies);

        // Actualizar características
        actualizarCaracteristicas(project.features);

    } catch (error) {
        console.error("Error al actualizar contenido:", error);
    }
}

// Función para actualizar tecnologías
function actualizarTecnologias(technologies) {
    const techContainer = document.getElementById('project-technologies');
    if (!techContainer) return;

    techContainer.innerHTML = '';

    if (!technologies || technologies.length === 0) {
        techContainer.innerHTML = '<span class="text-gray-400">No hay tecnologías especificadas</span>';
        return;
    }

    technologies.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        techContainer.appendChild(techTag);
    });
}

// Función para actualizar características
function actualizarCaracteristicas(features) {
    const featuresContainer = document.getElementById('project-features');
    if (!featuresContainer) return;

    featuresContainer.innerHTML = '';

    if (!features || features.length === 0) {
        featuresContainer.innerHTML = '<li class="text-gray-400">No hay características especificadas</li>';
        return;
    }

    features.forEach(feature => {
        const featureItem = document.createElement('li');
        featureItem.className = 'feature-item';
        featureItem.textContent = feature;
        featuresContainer.appendChild(featureItem);
    });
}

// === CARGA DE GALERÍA MEJORADA ===
function cargarGaleriaSinFallos(images) {
    const galleryContainer = document.getElementById('gallery');
    if (!galleryContainer) {
        console.error('Contenedor de galería (#gallery) no encontrado');
        return;
    }

    galleryContainer.innerHTML = '';

    if (!images || images.length === 0) {
        galleryContainer.innerHTML = '<div class="text-center py-4"><p class="text-gray-400">No hay imágenes disponibles</p></div>';
        return;
    }

    // Agregar evento de debug para cada imagen
    const debugarImagenes = (e) => {
        console.log(`Imagen cargada correctamente: ${e.target.src}`);
        e.target.classList.remove('opacity-0');
    };

    const manejarErrorImagen = (e) => {
        console.error(`Error al cargar imagen: ${e.target.src}`);
        // Reemplazar con imagen de error
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 300"%3E%3Crect fill="%23303030" width="400" height="300"/%3E%3Ctext fill="%23999999" font-size="18" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
        e.target.classList.remove('opacity-0');
    };

    // Crear elementos de galería
    images.forEach(image => {
        if (!image || !image.url) return;

        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        // Agregar HTML con eventos directamente asignados
        galleryItem.innerHTML = `
      <img 
        src="${image.url}" 
        alt="${image.title || 'Imagen del proyecto'}" 
        class="w-full h-full object-cover transition-opacity duration-300 opacity-0" 
      >
      <div class="gallery-overlay">
        <h3 class="text-white text-lg font-medium">${image.title || 'Imagen del proyecto'}</h3>
      </div>
    `;

        // Agregar listener después de crear el elemento
        const img = galleryItem.querySelector('img');
        img.addEventListener('load', debugarImagenes);
        img.addEventListener('error', manejarErrorImagen);

        galleryContainer.appendChild(galleryItem);
    });

    // Inicializar desplazamiento suave
    initSmoothScroll();
}

// === CARGA DE PROYECTOS RELACIONADOS MEJORADA ===
function cargarProyectosRelacionados(currentId) {
    const otherProjectsContainer = document.getElementById('other-projects');
    if (!otherProjectsContainer) {
        console.error('Contenedor de otros proyectos (#other-projects) no encontrado');
        return;
    }

    otherProjectsContainer.innerHTML = '';

    // Filtrar proyectos relacionados
    const relatedProjects = allProjects.filter(project => project.id != currentId);

    if (relatedProjects.length === 0) {
        otherProjectsContainer.innerHTML = '<div class="text-center py-4"><p class="text-gray-400">No hay otros proyectos disponibles</p></div>';
        return;
    }

    relatedProjects.forEach(project => {
        try {
            const projectCard = document.createElement('div');
            projectCard.className = 'group bg-[#0e0021]/60 rounded-xl overflow-hidden border border-purple-900/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 flex flex-col h-full';

            const techTags = project.technologies
                .slice(0, 3)
                .map(tech => `<span class="bg-[#14002a] text-purple-400 text-xs px-3 py-1 rounded-full">${tech}</span>`)
                .join('');

            projectCard.innerHTML = `
        <div class="p-6 flex-grow">
          <h3 class="text-white text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">${project.title}</h3>
          <p class="text-gray-400 mb-4 text-sm">${project.description.substring(0, 100)}...</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${techTags}
          </div>
        </div>
        <div class="p-6 pt-0 mt-auto">
          <a href="/proyecto-${project.id}" class="btn-primary w-full justify-center inline-block text-center py-2 px-4 bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition-colors">Ver proyecto</a>
        </div>
      `;

            otherProjectsContainer.appendChild(projectCard);
        } catch (error) {
            console.error(`Error al crear tarjeta para proyecto ${project.id}:`, error);
        }
    });
}

// === FUNCIONES AUXILIARES ===

// Inicializar el comportamiento de desplazamiento horizontal suave
function initSmoothScroll() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) {
        console.error('Contenedor para scroll (#gallery-container) no encontrado');
        return;
    }

    let isDown = false;
    let startX;
    let scrollLeft;

    // Limpiar eventos anteriores
    galleryContainer.removeEventListener('mousedown', handleMouseDown);
    galleryContainer.removeEventListener('mouseleave', handleMouseLeave);
    galleryContainer.removeEventListener('mouseup', handleMouseUp);
    galleryContainer.removeEventListener('mousemove', handleMouseMove);

    // Definir manejadores de eventos
    function handleMouseDown(e) {
        isDown = true;
        galleryContainer.classList.add('active');
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
    }

    function handleMouseLeave() {
        isDown = false;
        galleryContainer.classList.remove('active');
    }

    function handleMouseUp() {
        isDown = false;
        galleryContainer.classList.remove('active');
    }

    function handleMouseMove(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2;
        galleryContainer.scrollLeft = scrollLeft - walk;
    }

    // Agregar nuevos eventos
    galleryContainer.addEventListener('mousedown', handleMouseDown);
    galleryContainer.addEventListener('mouseleave', handleMouseLeave);
    galleryContainer.addEventListener('mouseup', handleMouseUp);
    galleryContainer.addEventListener('mousemove', handleMouseMove);
}

// Inicializar animaciones con GSAP (con verificación)
function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn("GSAP no está disponible. Animaciones desactivadas.");
        return;
    }

    try {
        // Animación para el encabezado del proyecto
        if (document.getElementById('project-title')) {
            gsap.from('#project-title', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        if (document.getElementById('project-category') && document.getElementById('project-date')) {
            gsap.from('#project-category, #project-date', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out'
            });
        }

        // Animación para la descripción
        if (document.getElementById('project-description')) {
            gsap.from('#project-description', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: 'power3.out'
            });
        }

        // Animación para las imágenes de la galería
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0 && document.getElementById('gallery-container')) {
            gsap.from('.gallery-item', {
                x: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#gallery-container',
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Animación para los otros proyectos
        const otherProjects = document.querySelectorAll('#other-projects > div');
        if (otherProjects.length > 0) {
            gsap.from('#other-projects > div', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#other-projects',
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none'
                }
            });
        }
    } catch (error) {
        console.error("Error al inicializar animaciones:", error);
    }
}

// Función para mostrar notificación de éxito
function mostrarNotificacion(mensaje, duracion = 3000) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 opacity-0 translate-y-4';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    // Mostrar la notificación con animación
    setTimeout(() => {
        notificacion.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    // Ocultar y eliminar después de la duración
    setTimeout(() => {
        notificacion.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => notificacion.remove(), 300);
    }, duracion);
}

// Función para mostrar error
function mostrarError(mensaje, duracion = 4000) {
    const error = document.createElement('div');
    error.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl opacity-0 scale-95 transition-all duration-300';
    error.innerHTML = `
    <div class="flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${mensaje}</span>
    </div>
  `;
    document.body.appendChild(error);

    // Mostrar con animación
    setTimeout(() => {
        error.classList.remove('opacity-0', 'scale-95');
        error.classList.add('opacity-100', 'scale-100');
    }, 10);

    // Ocultar y eliminar después de la duración
    setTimeout(() => {
        error.classList.remove('opacity-100', 'scale-100');
        error.classList.add('opacity-0', 'scale-95');
        setTimeout(() => error.remove(), 300);
    }, duracion);
}

// Mostrar menú móvil
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            if (mobileMenu.classList.contains('opacity-0')) {
                mobileMenu.classList.remove('opacity-0', '-translate-y-8', 'pointer-events-none');
                mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            } else {
                mobileMenu.classList.add('opacity-0', '-translate-y-8', 'pointer-events-none');
                mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }
        });
    }
});

// === AÑADIR ESTILOS CRÍTICOS PARA IMÁGENES ===
function agregarEstilosCriticos() {
    const style = document.createElement('style');
    style.textContent = `
    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      margin-right: 1rem;
      flex: 0 0 auto;
      width: 300px;
      height: 200px;
      border: 1px solid rgba(128, 90, 213, 0.2);
      background-color: rgba(14, 0, 33, 0.4);
    }
    
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .gallery-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      padding: 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
    
    .gallery-item:hover .gallery-overlay {
      transform: translateY(0);
    }
    
    #gallery {
      display: flex;
      flex-wrap: nowrap;
      gap: 1rem;
      padding: 1rem 0;
    }
    
    #gallery-container {
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(128, 90, 213, 0.5) rgba(14, 0, 33, 0.2);
      min-height: 220px;
      margin: 2rem 0;
      padding-bottom: 10px;
    }
    
    #gallery-container::-webkit-scrollbar {
      height: 6px;
    }
    
    #gallery-container::-webkit-scrollbar-track {
      background: rgba(14, 0, 33, 0.2);
      border-radius: 3px;
    }
    
    #gallery-container::-webkit-scrollbar-thumb {
      background: rgba(128, 90, 213, 0.5);
      border-radius: 3px;
    }
  `;
    document.head.appendChild(style);
}

// Iniciar la carga del proyecto
garantizarCargaCompleta();
agregarEstilosCriticos();