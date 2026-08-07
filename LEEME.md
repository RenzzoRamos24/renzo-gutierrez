# Sitio de Renzo Gutiérrez

Sitio estático: HTML, CSS y JavaScript sin dependencias, sin compilar y sin
framework. Se abre con doble clic o se sube tal cual a cualquier hosting.

## Estructura

```
index.html            estructura y contenido (sólo marcado)
css/
  estilos.css         todo el diseño
  sin-js.css          respaldo para navegadores sin JavaScript
js/
  tema.js             modo día/noche antes del primer pintado (va en el <head>)
  demos.js            configuración de las demos  ← el archivo que vas a editar
  sitio.js            tema, ventana de demo, apariciones, menú activo
renzo-gutierrez.html  versión original de un solo archivo (referencia)
```

## Cómo conectar una demo

Todo se hace en `js/demos.js`. Cada demo se identifica con la misma clave que
lleva el botón en `index.html` (atributo `data-demo`).

**Un video:** guarda el MP4 en una carpeta `demos/` junto al `index.html` y deja:

```js
"importador": {
  titulo: "Importador masivo a CONCAR",
  tipo:   "video",
  src:    "demos/importador.mp4",
  nota:   "Grabación con datos de prueba."
}
```

**Una app desplegada:** `tipo: "sitio"` y la URL en `src`.
Si el servidor no permite mostrarse incrustado, la ventana lo detecta y ofrece
abrirla en una pestaña nueva.

**Capturas:** `tipo: "fotos"` y una lista en `src`:

```js
src: [{img:"demos/paso-1.png", pie:"Carga por lote"},
      {img:"demos/paso-2.png", pie:"Resultado"}]
```

**Sin demo todavía:** deja `tipo: ""`; se muestra un aviso ordenado.

## Cómo poner la foto

En `index.html`, sección *sobre mí*, hay un bloque comentado con la etiqueta
`AQUÍ VA LA FOTO`. Descoméntalo y deja `foto.jpg` junto al `index.html`.
Recorte vertical, proporción 4:5.

## Publicar

Cualquier hosting estático sirve (GitHub Pages, Netlify, Vercel, Cloudflare
Pages, o una carpeta en tu propio servidor). Se sube la carpeta completa;
no hay paso de build.

## Pendiente

- Los textos de 9.5–10.5 px en gris (`--text-3`) y la etiqueta "en desarrollo"
  quedan por debajo del contraste AA de WCAG. No se tocó la paleta para no
  alterar el diseño; se corrige oscureciendo `--text-3` en `css/estilos.css`.
