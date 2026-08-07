# Plan de implementación: Demos verificables y publicación del sitio

**Rama**: `main` | **Fecha**: 2026-08-07 | **Spec**: [spec.md](./spec.md)

**Entrada**: especificación en `specs/001-demos-y-publicacion/spec.md`

## Resumen

Llevar el portafolio de archivos sueltos en un disco a un sitio público que se
actualiza empujando a `main`, y dejar sus demos en un estado que se pueda
enseñar: la grabación del importador a CONCAR comprimida y conectada, las
capturas de Nexplanilla publicadas con advertencia de datos ficticios, y
cualquier demo ampliable a pantalla completa.

El enfoque técnico se somete al principio I de la constitución: sin compilación
ni dependencias. Todo el trabajo se resuelve editando tres archivos planos
(`js/demos.js`, `js/sitio.js`, `css/estilos.css`), preparando los archivos
multimedia con herramientas locales, y apoyándose en GitHub Pages, que sirve la
carpeta tal cual sin pedir un paso de construcción.

## Contexto técnico

**Lenguaje/Versión**: HTML5, CSS3 y JavaScript de estilo ES5 (`var`, sin módulos,
sin sintaxis moderna), coherente con el código que ya existía.

**Dependencias principales**: ninguna en tiempo de ejecución. En tiempo de
preparación: `ffmpeg` para comprimir el video y grabar la marca de agua.

**Almacenamiento**: archivos estáticos. `localStorage` guarda únicamente la
preferencia de tema día/noche.

**Pruebas**: `node --check` para sintaxis; Chrome en modo headless (`--dump-dom`)
ejecutando afirmaciones sobre una página de prueba desechable; `curl` contra la
URL pública para verificar lo publicado.

**Plataforma objetivo**: navegadores de escritorio y móvil actuales, con respaldo
declarado para los que no ofrecen pantalla completa por elemento.

**Tipo de proyecto**: sitio estático de una sola página.

**Objetivos de rendimiento**: la grabación por debajo de 10 MB; las capturas por
debajo de 1 MB en conjunto; sin parpadeo de tema en la primera carga.

**Restricciones**: sin paso de construcción; sin dependencias de ejecución; sin
cuentas de terceros más allá de la de GitHub ya autenticada; nada de datos reales
de clientes.

**Escala/Alcance**: 10 proyectos en la página, 3 de ellos con demo conectada.

## Comprobación contra la constitución

*PUERTA: debe pasarse antes de la fase 0 y volver a comprobarse tras el diseño.*

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I. Sin compilación ni dependencias | Cumple | No se añadió `package.json` ni empaquetador. `ffmpeg` se usa una vez para preparar archivos, no forma parte del sitio. |
| II. Un solo archivo para configurar demos | Cumple | Las dos demos nuevas se conectaron editando solo `js/demos.js`. El aviso se añadió como campo opcional, ampliando el vocabulario en vez de obligar a tocar más archivos. |
| III. Los datos de cliente no salen | Cumple | Las cinco capturas se revisaron una por una antes de publicar. La advertencia va en la página y grabada en la imagen. |
| IV. Degradar con dignidad | Cumple | Respaldo en CSS para navegadores sin pantalla completa por elemento. |
| V. Verificar antes de afirmar | Cumple | 22 afirmaciones automáticas en navegador real, comparación visual de fotogramas y verificación contra la URL pública. |

Sin violaciones que justificar; el apartado de complejidad queda vacío.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/001-demos-y-publicacion/
├── spec.md      # qué y por qué
├── plan.md      # este archivo: cómo
└── tasks.md     # el trabajo, tarea a tarea
```

### Código fuente (raíz del repositorio)

```text
index.html              marcado; la ventana de demo vive al final
css/
  estilos.css           todo el diseño, incluida la pantalla completa
  sin-js.css            respaldo para navegadores sin JavaScript
js/
  tema.js               día/noche antes del primer pintado (va en el <head>)
  demos.js              configuración de las demos  ← el único que se edita
  sitio.js              tema, ventana de demo, apariciones, menú activo
demos/
  importador.mp4        grabación comprimida (6,9 MB)
  nexplanilla-*.jpg     cinco capturas con marca de datos ficticios
  importador-original.mp4   original de 164 MB, fuera del repositorio
  sin-marca/            capturas sin marca, fuera del repositorio
netlify.toml            configuración de un camino de despliegue no usado
renzo-gutierrez.html    versión original de un solo archivo (referencia)
```

**Decisión de estructura**: se mantiene la disposición plana que ya tenía el
proyecto. No se introdujo `src/` ni `tests/`: no hay construcción que separe
fuente de salida, y las pruebas son páginas desechables que se crean, se ejecutan
y se borran en el mismo paso, sin quedar en el repositorio.

## Decisiones de diseño

### Compresión del video

Origen: 1280×720 a 30 fps, 6.167 kb/s, 3:32, 164 MB. Es una grabación de
pantalla: fotogramas casi estáticos, muy comprimibles.

Elegido: x264 CRF 26, preset `slow`, `+faststart`, audio AAC a 96 kb/s.
Resultado 6,9 MB (155 kb/s de video). Se conservan resolución y duración; no se
reescaló, porque bajar de 720p habría emborronado el texto de la aplicación.

Se comprobó midiendo el volumen que la pista de audio no está en silencio —hay
narración— y por eso no se descartó el audio, aunque la ventana reproduzca
silenciada.

Alternativa descartada: dejarlo tal cual. Habría hecho inviable GitHub Pages,
que rechaza archivos de más de 100 MB.

### Pantalla completa

Se pide `requestFullscreen` sobre el elemento adecuado: el `video` en las
grabaciones, el contenedor `.shots` en las galerías, y la propia `img` cuando se
pulsa una captura concreta.

Cuando la API no está disponible para elementos —Safari de iPhone solo la ofrece
en `video`— se aplica una clase `.fs-fallback` que fija el elemento sobre toda la
ventana. La detección es por capacidad, no por navegador.

Las reglas `:fullscreen` y `:-webkit-full-screen` se escriben en bloques
separados a propósito: un navegador que no entienda uno de los dos selectores
descarta la regla entera, y juntas se anularían.

`Escape` se trata en dos tiempos: reduce si hay algo ampliado, cierra si no. Y
cerrar la ventana sale de pantalla completa primero, para no dejar la página
bloqueada.

### Advertencia de datos ficticios

Va en dos sitios porque uno solo no cubre el riesgo:

1. Un recuadro sobre la galería, declarado como campo `aviso` en `demos.js`.
2. La marca «DATOS FICTICIOS» grabada en cada imagen con `drawtext`, abajo a la
   derecha, en tipografía monoespaciada.

La segunda es la que protege de verdad: el recuadro desaparece al ampliar una
captura —justo cuando los datos se leen mejor— y no acompaña al archivo si
alguien lo descarga. La posición se eligió comprobando sobre la captura más
delicada que no tapara ningún dato.

Las capturas sin marca se conservan en `demos/sin-marca/`, ignorada por git, para
poder regenerar la marca sin pérdida de calidad.

### Publicación

GitHub Pages sobre la rama `main`. Se eligió sobre Vercel y Netlify por una razón
concreta: `gh` ya estaba autenticado, así que no hacía falta crear ninguna cuenta
ni autorizar ningún acceso desde el navegador. El coste aceptado es que el
repositorio queda público.

`netlify.toml` se escribió antes de esa decisión y ya no interviene. Se conserva
porque no estorba y deja el camino abierto si algún día el repositorio debe ser
privado.

Se añade `.nojekyll` para que Pages sirva los archivos tal cual en lugar de
procesarlos con Jekyll. Sin él, un archivo Markdown con sintaxis que Jekyll
intente interpretar puede hacer fallar la construcción del sitio entero.

## Seguimiento de complejidad

Sin violaciones de la constitución que justificar.
