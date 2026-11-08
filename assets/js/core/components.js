// Carga fragmentos comunes desde un servidor HTTP para evitar repetir markup.

/** Inserta en paralelo los componentes compartidos declarados en data-include. */
export async function loadSharedComponents() {
  const slots = [...document.querySelectorAll('[data-include]')];

  await Promise.all(slots.map(async (slot) => {
    const source = slot.dataset.include;

    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      slot.innerHTML = await response.text();
    } catch (error) {
      console.error(`No se pudo cargar ${source}`, error);
      slot.innerHTML = '<p class="component-error">Abre el proyecto desde un servidor local para cargar los componentes.</p>';
    }
  }));
}
