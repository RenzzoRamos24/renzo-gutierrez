/* =====================================================================
   tema.js — decide día o noche ANTES de que la página se pinte.
   Va en el <head> y sin "defer" a propósito: si corriera después,
   quien tiene modo noche vería un parpadeo blanco en cada carga.
   ===================================================================== */
(function(){
  var guardado = null;
  try { guardado = localStorage.getItem('tema'); } catch (e) {}

  /* sitio.js lo lee para saber si el usuario ya eligió o si todavía
     hay que seguir la preferencia del sistema operativo */
  window.__temaGuardado = guardado;

  var tema = guardado;
  if (!tema) {
    tema = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  window.__tema = tema;

  if (tema === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); }
})();
