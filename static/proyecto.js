// Variables globales
let projectId;
let allProjects = [];

// Mostrar/ocultar menú móvil
document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('opacity-0')) {
        mobileMenu.classList.remove('opacity-0', '-translate-y-8', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    } else {
        mobileMenu.classList.add('opacity-0', '-translate-y-8', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    }
});

// Obtener el ID del proyecto de la URL
function getProjectIdFromUrl() {
    const urlPath = window.location.pathname;
    const match = urlPath.match(/proyecto-(\d+)/);
    return match ? match[1] : '1'; // Por defecto, mostrar el proyecto 1
}

// Cargar datos del proyecto
async function loadProjectData() {
    projectId = getProjectIdFromUrl();

    // Definición de todos los proyectos
    allProjects = [
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
        },
        {
            id: 4,
            title: 'MCP Weather',
            category: 'Seridor MCP',
            date: 'Abril 2025',
            description: 'He creado un servidor MCP para que la gente pueda ver el tiempo en su ciudad y en otras ciudades a través de un servicio que use MCP por ejemplo claude',
            technologies: ['Node.js', 'TypeScript', 'Python'],
            features: [
                'Lamada a la API de Open Meteo',
                'Diferentes herramientas para el servidor',
                'Conexión con servicios como Claude o ChatGPT',
                'Codigo abierto',
            ],
            demoUrl: 'https://github.com/diegogzt/MCP-Weather.git',
            githubUrl: 'https://github.com/diegogzt/MCP-Weather.git',
            gallery: [
                { url: 'img/mcp-r2.png', title: 'Codigo TypeScript' },
                { url: 'img/mcp-r3.png', title: 'Solicitud de herramienta en Claude' },
                { url: 'img/mcp-r4.png', title: 'Respuesta del servicio de Claude conectado al MCP' },
            ]
        },
        

    ];

    // Encontrar el proyecto actual
    const currentProject = allProjects.find(project => project.id == projectId);

    if (currentProject) {
        // Actualizar el contenido de la página
        updateProjectContent(currentProject);

        // Cargar la galería de imágenes
        loadGallery(currentProject.gallery);

        // Cargar otros proyectos relacionados
        loadOtherProjects(currentProject.id);

        // Inicializar animaciones
        initAnimations();
    } else {
        // Proyecto no encontrado, redirigir a la página principal
        window.location.href = '/';
    }
}

// Actualizar el contenido de la página con los datos del proyecto
function updateProjectContent(project) {
    // Actualizar la cabecera
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-category').textContent = project.category;
    document.getElementById('project-date').textContent = project.date;

    // Actualizar la descripción
    document.getElementById('project-description').textContent = project.description;

    // Actualizar enlaces
    document.getElementById('project-demo').href = project.demoUrl;
    document.getElementById('project-github').href = project.githubUrl;

    // Actualizar tecnologías
    const techContainer = document.getElementById('project-technologies');
    techContainer.innerHTML = '';

    project.technologies.forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        techContainer.appendChild(techTag);
    });

    // Actualizar características
    const featuresContainer = document.getElementById('project-features');
    featuresContainer.innerHTML = '';

    project.features.forEach(feature => {
        const featureItem = document.createElement('li');
        featureItem.className = 'feature-item';
        featureItem.textContent = feature;
        featuresContainer.appendChild(featureItem);
    });
}

// Modificar la función loadGallery para asegurarnos de que el contenedor de la galería esté completamente renderizado antes de cargar las imágenes
function loadGallery(images) {
    const galleryContainer = document.getElementById('gallery');

    // Esperar a que el contenedor esté disponible
    if (!galleryContainer) {
        console.warn('El contenedor de la galería no está disponible. Reintentando...');
        setTimeout(() => loadGallery(images), 100); // Reintentar después de 100ms
        return;
    }

    galleryContainer.innerHTML = '';

    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        galleryItem.innerHTML = `
            <img src="${image.url}" alt="${image.title}">
            <div class="gallery-overlay">
                <h3 class="text-white text-lg font-medium">${image.title}</h3>
            </div>
        `;

        galleryContainer.appendChild(galleryItem);
    });

    // Inicializar el comportamiento de desplazamiento horizontal suave
    initSmoothScroll();
}

// Cargar otros proyectos relacionados
function loadOtherProjects(currentId) {
    const otherProjectsContainer = document.getElementById('other-projects');
    if (!otherProjectsContainer) return; // Verificar si el elemento existe

    otherProjectsContainer.innerHTML = '';

    // Filtrar proyectos para excluir el actual
    const relatedProjects = allProjects.filter(project => project.id != currentId);

    relatedProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'group bg-[#0e0021]/60 rounded-xl overflow-hidden border border-purple-900/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 flex flex-col h-full';

        projectCard.innerHTML = `
        <div class="p-6 flex-grow">
            <h3 class="text-white text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">${project.title}</h3>
            <p class="text-gray-400 mb-4 text-sm">${project.description.substring(0, 100)}...</p>

            <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.slice(0, 3).map(tech => `<span class="bg-[#14002a] text-purple-400 text-xs px-3 py-1 rounded-full">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="p-6 pt-0 mt-auto">
            <a href="/proyecto-${project.id}" class="btn-primary w-full justify-center">Ver proyecto</a>
        </div>
        `;

        otherProjectsContainer.appendChild(projectCard);
    });
}

// Inicializar el comportamiento de desplazamiento horizontal suave
function initSmoothScroll() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return; // Verificar si el elemento existe

    let isDown = false;
    let startX;
    let scrollLeft;

    galleryContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryContainer.classList.add('active');
        startX = e.pageX - galleryContainer.offsetLeft;
        scrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isDown = false;
        galleryContainer.classList.remove('active');
    });

    galleryContainer.addEventListener('mouseup', () => {
        isDown = false;
        galleryContainer.classList.remove('active');
    });

    galleryContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryContainer.offsetLeft;
        const walk = (x - startX) * 2;
        galleryContainer.scrollLeft = scrollLeft - walk;
    });
}

// Modificar la inicialización de animaciones para asegurarnos de que se ejecuten correctamente
function initAnimations() {
    // Verificar si GSAP está disponible
    if (typeof gsap === 'undefined') {
        console.warn('GSAP no está disponible. Asegúrate de incluir la biblioteca GSAP.');
        return;
    }

    // Esperar a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Verificar si hay elementos de galería antes de animarlos
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryContainer = document.getElementById('gallery-container');

        // Animación para el encabezado del proyecto
        gsap.from('#project-title', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('#project-category, #project-date', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });

        // Animación para la descripción y tecnologías
        gsap.from('#project-description', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'power3.out'
        });

        // Animación para las imágenes de la galería
        if (galleryItems.length > 0 && galleryContainer) {
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
        const otherProjectsContainer = document.getElementById('other-projects');
        if (otherProjectsContainer && otherProjectsContainer.children.length > 0) {
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
    });
}

// Cargar los datos del proyecto al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    loadProjectData();
    // No llamamos a loadGallery() y loadOtherProjects() directamente aquí
    // porque ya se llaman dentro de loadProjectData()

    // Inicializamos las animaciones por si hay elementos que ya existen en el DOM
    initAnimations();
});

