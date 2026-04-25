let catalogoData = [];

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("movieModal");
  // Cerrar con botón
  document.querySelector(".close-btn").addEventListener("click", cerrarModal);
  // Cerrar haciendo click fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });
  try {
    const response = await fetch("events.json");
    catalogoData = await response.json();
    mostrarCatalogo(catalogoData);
  } catch (error) {
    console.error("Error cargando el catálogo:", error);
  }
});

function mostrarCatalogo(catalogoData) {
  const catalogoGrid = document.querySelector(".catalog-grid");
  catalogoGrid.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    catalogoData.forEach((catalogo) => {
      const catalogoItem = document.createElement("div");
      catalogoItem.className = "catalogo-item";

      catalogoItem.style.cursor = "pointer";
      catalogoItem.setAttribute("data-catalogo-id", catalogo.id);

      catalogoItem.innerHTML = `
      <img src="${catalogo.image}" alt="${catalogo.name}" />
      <div class="movie-info">
        <h3>${catalogo.name}</h3>
        <p>${catalogo.price}</p>
      </div>
    `;

      catalogoItem.addEventListener("click", () => {
        mostrarDetalles(catalogo.id);
      });
      catalogoGrid.appendChild(catalogoItem);
    });
  }
}

function mostrarDetalles(Id) {
  const catalogo = catalogoData.find((p) => p.id === Id);

  // Rellenar el modal con los datos de la película
  document.getElementById("modalImage").src = catalogo.image;
  document.getElementById("modalDescription").textContent =
    catalogo.description;

  // Mostrar el modal
  document.getElementById("movieModal").classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevenir scroll del body
}

// Función para cerrar el modal
function cerrarModal() {
  document.getElementById("movieModal").classList.add("hidden");
  document.body.style.overflow = "auto"; // Restaurar scroll del body
}
