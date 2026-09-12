/* =========================================================
   GameZone - Semana 5 - Manipulando el DOM con JavaScript
   Sergio Mascareno - PFY2201 - Desarrollo Frontend I
   ========================================================= */

// -----------------------------------------------------------
// Formulario de contacto: valida y responde al evento submit
// -----------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('form-contacto');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // evita el envío real (no hay backend)

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    feedback.innerHTML = ''; // limpia cualquier mensaje anterior

    if (!nombre || !email || !mensaje) {
      mostrarFeedback('danger', 'Por favor completa todos los campos antes de enviar.');
      return;
    }

    // Éxito: se crea el mensaje de confirmación dinámicamente
    mostrarFeedback('success', `¡Gracias, ${nombre}! Tu mensaje fue recibido correctamente.`);
    form.reset();
  });

  // Crea y agrega un mensaje de feedback al DOM (createElement + appendChild)
  function mostrarFeedback(tipo, texto) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = texto;
    feedback.appendChild(alerta);
  }
}

// -----------------------------------------------------------
// Interacción en las cards: click para expandir/colapsar el
// detalle, mouseover/mouseout para resaltar visualmente.
// Se aplica tanto a las cards que ya existen en el HTML como
// a las que se agregan después mediante la Fetch API.
// -----------------------------------------------------------
function activarInteraccionCard(card) {
  card.addEventListener('mouseover', () => card.classList.add('card-hover'));
  card.addEventListener('mouseout', () => card.classList.remove('card-hover'));

  const boton = card.querySelector('.js-toggle-detalle');
  if (!boton) return;

  boton.addEventListener('click', (e) => {
    e.preventDefault();
    const cardBody = boton.closest('.card-body');
    let detalle = cardBody.querySelector('.detalle-extra');

    if (detalle) {
      // Ya existe: solo se alterna la visibilidad
      detalle.classList.toggle('d-none');
    } else {
      // Primera vez: se crea dinámicamente con el texto de data-detalle
      detalle = document.createElement('p');
      detalle.className = 'detalle-extra text-muted small mt-2';
      detalle.textContent = card.dataset.detalle || 'Sin información adicional disponible.';
      cardBody.insertBefore(detalle, boton);
    }

    // Alterna el texto del botón y su estado de accesibilidad
    const expandido = !detalle.classList.contains('d-none');
    boton.setAttribute('aria-expanded', String(expandido));
    boton.textContent = expandido
      ? boton.textContent.replace('Ver más', 'Ver menos').replace('Ver oferta', 'Ocultar oferta')
      : boton.textContent.replace('Ver menos', 'Ver más').replace('Ocultar oferta', 'Ver oferta');
  });
}

function initCardInteractions() {
  document.querySelectorAll('.card').forEach(activarInteraccionCard);
}

// -----------------------------------------------------------
// Fetch API: carga juegos adicionales desde juegos.json y los
// agrega dinámicamente al catálogo mediante createElement
// -----------------------------------------------------------
function initCargarMasJuegos() {
  const boton = document.getElementById('btn-cargar-juegos');
  const contenedor = document.getElementById('catalogo-extra');
  const estado = document.getElementById('catalogo-estado');

  if (!boton) return;

  boton.addEventListener('click', () => {
    boton.disabled = true;
    boton.textContent = 'Cargando...';
    estado.textContent = '';

    fetch('juegos.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(juegos => {
        juegos.forEach(juego => contenedor.appendChild(crearCardJuego(juego)));
        boton.remove(); // ya se cargó todo el contenido disponible
      })
      .catch(error => {
        // Manejo de errores: informa al usuario sin romper la página
        console.error('Error al cargar juegos.json:', error);
        estado.textContent = 'No se pudieron cargar más juegos en este momento. Intenta nuevamente más tarde.';
        estado.className = 'text-danger text-center mt-3';
        boton.disabled = false;
        boton.textContent = 'Cargar más juegos';
      });
  });

  // Construye una card completa a partir de los datos del JSON
  function crearCardJuego(juego) {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <div class="card h-100 shadow-sm" data-detalle="${juego.descripcion}">
        <img src="${juego.imagen}" class="card-img-top" alt="Portada de ${juego.titulo}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${juego.titulo}</h5>
          <p class="card-text">${juego.descripcion}</p>
          <a href="#" class="btn btn-primary mt-auto js-toggle-detalle" aria-expanded="false">Ver más</a>
        </div>
      </div>
    `;

    // Engancha los mismos eventos click/mouseover a la card recién creada
    activarInteraccionCard(col.querySelector('.card'));
    return col;
  }
}

// -----------------------------------------------------------
// Inicialización: se ejecuta cuando el DOM está listo
// -----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCardInteractions();
  initCargarMasJuegos();
});
