/* =====================================================================
   tema.js — el sitio es siempre oscuro (negro grisáceo).
   Va en el <head> y sin "defer" a propósito: si corriera después,
   se vería un parpadeo blanco en cada carga.
   ===================================================================== */
document.documentElement.setAttribute('data-theme', 'dark');
