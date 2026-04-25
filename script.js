let catalogoData = [];

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("eventModal");

  document.querySelector(".close-btn").addEventListener("click", cerrarModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error("No se encontró el archivo events.json");
    }

    catalogoData = await response.json();
    mostrarCatalogo(catalogoData);
  } catch (error) {
    console.error("Error cargando el catálogo:", error);

    document.querySelector(".catalog-grid").innerHTML = `
      <p style="color: red; font-weight: bold;">
        No se pudo cargar el catálogo. Revisa que el archivo events.json esté bien escrito y en la misma carpeta.
      </p>
    `;
  }

  activarFormulario();
});

function mostrarCatalogo(catalogoData) {
  const catalogoGrid = document.querySelector(".catalog-grid");
  catalogoGrid.innerHTML = "";

  catalogoData.forEach((evento) => {
    const catalogoItem = document.createElement("article");
    catalogoItem.className = "catalogo-item";

    catalogoItem.innerHTML = `
      <div class="image-box">
        <img src="${evento.images[0]}" alt="${evento.title}" />
        ${evento.soldOut ? `<span class="sold-out">Sold Out</span>` : ""}
      </div>

      <div class="event-info">
        <span class="category">${evento.category}</span>
        <h3>${evento.title}</h3>
        <p><strong>Lugar:</strong> ${evento.venue}, ${evento.city}</p>
        <p><strong>Fecha:</strong> ${formatearFecha(evento.datetime)}</p>
        <p><strong>Precio desde:</strong> ${evento.currency} ${evento.priceFrom.toFixed(2)}</p>
        <button class="detail-btn">Ver detalle</button>
      </div>
    `;

    catalogoItem.querySelector(".detail-btn").addEventListener("click", () => {
      mostrarDetalles(evento.id);
    });

    catalogoGrid.appendChild(catalogoItem);
  });
}

function mostrarDetalles(id) {
  const evento = catalogoData.find((item) => item.id === id);

  if (!evento) {
    alert("Evento no encontrado");
    return;
  }

  const modalGallery = document.getElementById("modalGallery");

  modalGallery.innerHTML = evento.images
    .map(
      (imagen) => `
        <img src="${imagen}" alt="Imagen de ${evento.title}" />
      `
    )
    .join("");

  document.getElementById("modalTitle").textContent = evento.title;
  document.getElementById("modalDescription").textContent = evento.description;
  document.getElementById("modalCategory").textContent = evento.category;
  document.getElementById("modalArtists").textContent = evento.artists.join(", ");
  document.getElementById("modalVenue").textContent = `${evento.venue}, ${evento.city}`;
  document.getElementById("modalDate").textContent = formatearFecha(evento.datetime);
  document.getElementById("modalPrice").textContent = `${evento.currency} ${evento.priceFrom.toFixed(2)}`;
  document.getElementById("modalStock").textContent = evento.soldOut ? "Agotado" : evento.stock;
  document.getElementById("modalAge").textContent = evento.policies.age;
  document.getElementById("modalRefund").textContent = evento.policies.refund;

  document.getElementById("eventModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.getElementById("eventModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  return fecha.toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function activarFormulario() {
  const form = document.getElementById("contactForm");
  const mensajeForm = document.getElementById("mensajeForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const consulta = document.getElementById("consulta").value.trim();

    if (nombre === "" || correo === "" || consulta === "") {
      mensajeForm.textContent = "Por favor, completa todos los campos.";
      mensajeForm.style.color = "red";
      return;
    }

    mensajeForm.textContent = "Sus datos han sido enviados correctamente.";
    mensajeForm.style.color = "green";

    form.reset();
  });
}
