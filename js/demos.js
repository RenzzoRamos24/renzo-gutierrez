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

   aviso: opcional. Sale como recuadro destacado encima de las capturas.
          Sirve para advertir que los datos son ficticios. Ojo: no se ve
          al ampliar una foto ni si alguien la descarga, así que la misma
          advertencia va grabada dentro de cada imagen.
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

  /* 07 — Nexplanilla. YA CONECTADA. El orden de las capturas sigue el
     recorrido real de la aplicación, igual que su menú lateral. */
  "planillas-app": {
    titulo: "Nexplanilla — aplicación de planillas",
    tipo:   "fotos",
    src:    [
      { img: "demos/nexplanilla-empresa.jpg",
        pie: "Alta de empresas: cada una con su régimen laboral, comisión AFP y SCTR." },
      { img: "demos/nexplanilla-trabajadores.jpg",
        pie: "Maestro de trabajadores de la empresa activa, con cargo, régimen pensionario y AFP." },
      { img: "demos/nexplanilla-calculos.jpg",
        pie: "Cálculo del período: ingresos, descuentos y neto a pagar, recalculado al entrar." },
      { img: "demos/nexplanilla-archivos.jpg",
        pie: "Generación del .jor y el .rem que importa el PDT PLAME." },
      { img: "demos/nexplanilla-asistente.jpg",
        pie: "Asistente de IA: interpreta el pedido del cliente y propone los cambios. Nada se modifica sin confirmación." }
    ],
    aviso:  "Todos los datos que se ven en estas capturas son ficticios: empresas, RUCs, nombres, DNIs y sueldos están inventados para no exponer información de ningún cliente. La aplicación es real; los datos no.",
    nota:   "Capturas de la versión en desarrollo."
  }

};
