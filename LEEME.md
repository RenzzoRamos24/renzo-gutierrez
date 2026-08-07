# Sitio de Renzo Gutiérrez

Sitio estático: HTML, CSS y JavaScript sin dependencias, sin compilar y sin
framework. Se abre con doble clic o se sube tal cual a cualquier hosting.

**En línea**: <https://renzzoramos24.github.io/renzo-gutierrez/>

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
demos/                los archivos de las demos (videos y capturas)
specs/                especificaciones de Spec Kit: qué se construyó y por qué
.specify/             plantillas y constitución del proyecto
renzo-gutierrez.html  versión original de un solo archivo (referencia)
netlify.toml          camino de despliegue alternativo; hoy no interviene
```

## Cómo conectar una demo

Todo se hace en `js/demos.js`. Cada demo se identifica con la misma clave que
lleva el botón en `index.html` (atributo `data-demo`).

**Un video:** guarda el MP4 en `demos/` y deja:

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

**Capturas:** `tipo: "fotos"` y una lista en `src`. Cada `pie` sirve además de
texto alternativo, así que conviene que describa la imagen:

```js
src: [{img:"demos/paso-1.png", pie:"Carga por lote"},
      {img:"demos/paso-2.png", pie:"Resultado"}]
```

**Sin demo todavía:** deja `tipo: ""`; se muestra un aviso ordenado.

**Aviso opcional:** en las demos de fotos, el campo `aviso` pinta un recuadro
destacado encima de las capturas. Se usa para advertir que los datos son
ficticios. Ojo con su límite: no se ve al ampliar una foto ni si alguien la
descarga, así que la misma advertencia debe ir grabada dentro de la imagen.

Demos conectadas hoy: `colegio` (sitio), `importador` (video) y `planillas-app`
(capturas). Las demás siguen con `tipo: ""`.

## Preparar los archivos de una demo

Se hace una vez, con `ffmpeg`, antes de publicar.

**Comprimir una grabación de pantalla.** Sin esto, un video de tres minutos puede
pesar más de 100 MB y GitHub lo rechaza:

```sh
ffmpeg -i original.mp4 -c:v libx264 -crf 26 -preset slow \
       -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k \
       demos/nombre.mp4
```

No bajes la resolución: emborrona el texto de la interfaz grabada.

**Grabar la marca de datos ficticios en una captura:**

```sh
ffmpeg -i original.jpg -vf "drawtext=fontfile='C\:/Windows/Fonts/consola.ttf':\
text='DATOS FICTICIOS':fontcolor=white@0.95:fontsize=17:box=1:\
boxcolor=black@0.62:boxborderw=9:x=w-tw-18:y=h-th-18" -q:v 2 demos/nombre.jpg
```

Los originales sin comprimir y sin marca se quedan en local, ignorados por git
(`demos/*-original.mp4` y `demos/sin-marca/`).

## Ver las demos en grande

La ventana de demo tiene un botón **⤢ ampliar** en las de video y de capturas.
Además, cada captura se amplía por separado con un clic. Estando ampliado,
`Escape` reduce y deja la ventana abierta; el segundo `Escape` la cierra.

## Cómo poner la foto

En `index.html`, sección *sobre mí*, hay un bloque comentado con la etiqueta
`AQUÍ VA LA FOTO`. Descoméntalo y deja `foto.jpg` junto al `index.html`.
Recorte vertical, proporción 4:5.

## Publicar

El sitio está en GitHub Pages, servido desde la rama `main` del repositorio
`RenzzoRamos24/renzo-gutierrez`. Para actualizarlo:

```sh
git add -A
git commit -m "lo que cambiaste"
git push
```

En uno o dos minutos el sitio se reconstruye solo. No hay paso de build ni nada
que subir a mano.

Para comprobar los cambios antes de publicarlos, levanta un servidor local — con
`file://` algunos navegadores se ponen quisquillosos con el video:

```sh
python3 -m http.server 8000
```

## Antes de publicar capturas o grabaciones

Míralas enteras. Ninguna demo puede mostrar información real de un cliente: ni
RUCs, ni DNIs, ni nombres, ni sueldos, ni montos. Si los datos son inventados
pero lo parecen, la advertencia va en la página **y** grabada en la imagen.

Está escrito con más detalle en `.specify/memory/constitution.md`.

## Pendiente

- Los textos de 9.5–10.5 px en gris (`--text-3`) y la etiqueta "en desarrollo"
  quedan por debajo del contraste AA de WCAG. No se tocó la paleta para no
  alterar el diseño; se corrige oscureciendo `--text-3` en `css/estilos.css`.
- La demo del importador se reproduce en bucle, y la grabación tiene narración y
  dura 3:32. Falta decidir si se quita el `loop` en `js/sitio.js`.
- El resto de tareas abiertas están en
  `specs/001-demos-y-publicacion/tasks.md`, al final.
