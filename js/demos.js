/* =====================================================================
   demos.js — CONFIGURACIÓN DE LAS DEMOS
   Este es el ÚNICO archivo que tienes que editar para conectar una demo.
   La clave de cada demo ("colegio", "importador"...) es la que aparece en
   el atributo data-demo del botón correspondiente, en index.html.

   tipo: "video"  → src = archivo .mp4 dentro de la carpeta demos/ (o una URL)
         "sitio"  → src = URL de la app desplegada (Azure, Vercel, Render...)
         "fotos"  → src = lista de imágenes con su descripción
         ""       → aún sin demo: se muestra un aviso ordenado

   Ejemplo de "fotos":
     src: [{img:"demos/paso-1.png", pie:"Carga por lote"},
           {img:"demos/paso-2.png", pie:"Resultado"}]
   ===================================================================== */
var DEMOS = {

  /* 01 — plataforma de cuestionarios (Sami). YA CONECTADA. */
  "colegio": {
    titulo: "Plataforma de cuestionarios",
    tipo:   "sitio",
    src:    "https://sami-app-9921877.azurewebsites.net/",
    nota:   "Aplicación en línea. El acceso a la información está protegido por credenciales."
  },

  /* 02 — importador masivo a CONCAR. YA CONECTADA. */
  "importador": {
    titulo: "Importador masivo a CONCAR",
    tipo:   "video",
    src:    "demos/importador.mp4",
    nota:   "Grabación de pantalla con datos de prueba. Sin RUCs ni montos reales."
  },

  /* 07 — Nexplanilla. Mismo procedimiento que el anterior cuando la tengas. */
  "planillas-app": {
    titulo: "Nexplanilla — aplicación de planillas",
    tipo:   "",
    src:    "",
    nota:   "En desarrollo. La demo se publica cuando la primera versión esté estable."
  }

};
