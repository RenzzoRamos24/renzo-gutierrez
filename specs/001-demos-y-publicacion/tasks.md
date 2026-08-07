---
description: "Lista de tareas de la funcionalidad 001-demos-y-publicacion"
---

# Tareas: Demos verificables y publicación del sitio

**Entrada**: documentos de diseño en `/specs/001-demos-y-publicacion/`

**Requisitos previos**: [plan.md](./plan.md), [spec.md](./spec.md)

**Pruebas**: sí. Se pidieron implícitamente al exigir que lo publicado se
verificara, y el principio V de la constitución las hace obligatorias.

**Organización**: agrupadas por historia de usuario, para que cada una se pueda
implementar y comprobar por separado.

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias)
- **[Historia]**: a qué historia de usuario pertenece (US1, US2, US3, US4)

## Estado

Las cuatro historias están **entregadas y en producción**. Lo que queda sin
marcar al final son decisiones pendientes, no trabajo a medias.

Commits: `c5fcf9d` · `a2283a7` · `fedfe5b` · `13ca5c9`

---

## Fase 1: Preparación

- [x] T001 Comprobar el estado real de partida: sin repositorio git, sin
      configuración de hosting, sin servidor local. El sitio se abría con
      `file://`, no en `localhost`.
- [x] T002 Inicializar el repositorio en `main` y configurar `.gitignore` con los
      archivos pesados que no se publican.
- [x] T003 [P] Escribir `netlify.toml` para el camino de despliegue considerado
      antes de decidir la plataforma.

---

## Fase 2: US2 — Demo en video del importador a CONCAR (P2)

**Objetivo**: que el proyecto 02 se pueda ver funcionando.

**Prueba independiente**: abrir la demo del proyecto 02 y ver la grabación.

- [x] T004 [US2] Localizar `ffmpeg` (estaba en el lado Windows, no en WSL) e
      inspeccionar la grabación: 1280×720, 30 fps, 6.167 kb/s, 3:32, 164 MB.
- [x] T005 [US2] Medir el volumen de la pista de audio para decidir si se
      conserva. Resultado: −13,2 dB de media, hay narración; se conserva.
- [x] T006 [US2] Comprimir con x264 CRF 26, preset `slow`, `+faststart`, audio
      AAC 96 kb/s → 6,9 MB.
- [x] T007 [US2] Verificar la calidad extrayendo el mismo fotograma del original
      y del comprimido y comparándolos: el texto de la aplicación sigue nítido.
- [x] T008 [US2] Mover la grabación a `demos/importador.mp4` y conservar el
      original como `demos/importador-original.mp4`, fuera del repositorio.
- [x] T009 [US2] Conectar la demo en `js/demos.js`: `tipo: "video"` y `src`.

---

## Fase 3: US1 — Publicar el sitio (P1)

**Objetivo**: que el portafolio tenga URL pública y se actualice solo.

**Prueba independiente**: pedir la URL desde fuera y recibir la página.

> Se ejecutó después de US2 por orden de peticiones, no por dependencia técnica.
> US1 es P1 porque sin ella ninguna otra historia entrega valor a nadie.

- [x] T010 [US1] Inventariar herramientas de despliegue disponibles. Hallazgo
      decisivo: `gh` ya autenticado como `RenzzoRamos24` con permiso `repo`.
- [x] T011 [US1] Presentar las opciones con sus costes reales (repositorio
      público en Pages frente a cuenta nueva en Vercel o Netlify) y recoger la
      decisión del usuario.
- [x] T012 [US1] Crear el repositorio público `RenzzoRamos24/renzo-gutierrez` y
      empujar `main`.
- [x] T013 [US1] Activar GitHub Pages desde `main`, raíz, con HTTPS forzado.
- [x] T014 [US1] Esperar la construcción y verificar contra la URL pública:
      página, hoja de estilos, guion y video, todos con código 200 y el video con
      el tamaño exacto del archivo local.

---

## Fase 4: US4 — Ampliar a pantalla completa (P4)

**Objetivo**: poder leer las demos en grande.

**Prueba independiente**: pulsar «ampliar» en una demo de video o de fotos.

- [x] T015 [US4] Leer el marcado, los estilos y la lógica de la ventana de demo
      antes de tocar nada.
- [x] T016 [US4] Añadir el botón «ampliar» en `index.html`, agrupado con el de
      cerrar en un contenedor `.modal-acts`.
- [x] T017 [US4] [P] Estilar el botón en `css/estilos.css` siguiendo la estética
      del sitio: monoespaciada, borde de un píxel, minúsculas.
- [x] T018 [US4] [P] Escribir las reglas `:fullscreen` y `:-webkit-full-screen`
      en bloques separados, más la clase `.fs-fallback` del respaldo.
- [x] T019 [US4] Implementar en `js/sitio.js` la petición de pantalla completa
      con detección por capacidad y respaldo en CSS.
- [x] T020 [US4] Mostrar el botón solo en demos de video y de fotos.
- [x] T021 [US4] Permitir ampliar una captura suelta pulsando sobre ella.
- [x] T022 [US4] Tratar `Escape` en dos tiempos: reducir si hay algo ampliado,
      cerrar si no.
- [x] T023 [US4] Salir de pantalla completa al cerrar la ventana, para no dejar
      la página bloqueada.
- [x] T024 [US4] Montar una página de prueba desechable con 14 afirmaciones y
      ejecutarla en Chrome headless. Resultado: 14 de 14.
- [x] T025 [US4] Borrar los archivos de prueba antes de confirmar los cambios.

---

## Fase 5: US3 — Galería de Nexplanilla (P3)

**Objetivo**: enseñar la aplicación de planillas sin exponer a ningún cliente.

**Prueba independiente**: abrir la demo del proyecto 07 y recorrer las capturas.

- [x] T026 [US3] Revisar las cinco capturas una por una antes de publicarlas,
      buscando datos que pudieran ser reales.
- [x] T027 [US3] Determinar a qué proyecto pertenecen. El usuario dijo
      «importación de planillas», que no es el nombre de ninguno; se resolvió a
      favor del 07 por ser el único de planillas con botón de demo y llamarse
      Nexplanilla, y se avisó de la interpretación.
- [x] T028 [US3] Mover y renombrar las capturas a `demos/nexplanilla-*.jpg` con
      nombres coherentes.
- [x] T029 [US3] Conectar la demo en `js/demos.js` como `tipo: "fotos"`, en el
      orden del recorrido real de la aplicación, con un pie por captura que sirve
      también de texto alternativo.
- [x] T030 [US3] Comprobar con 6 afirmaciones sobre la configuración real, no
      sobre una copia.
- [x] T031 [US3] Corregir la prueba, que medía si las imágenes habían cargado
      antes de darles tiempo. El fallo era de la prueba, no del código: las cinco
      rutas respondían con 200.

---

## Fase 6: US3 — Advertencia de datos ficticios

- [x] T032 [US3] Añadir el campo opcional `aviso` a la configuración de demos y
      pintarlo encima de la galería.
- [x] T033 [US3] [P] Estilar `.shots-aviso` con las variables de tema, para que
      funcione en modo día y en modo noche.
- [x] T034 [US3] [P] Grabar la marca «DATOS FICTICIOS» en las cinco capturas con
      `drawtext`, comprobando sobre la captura de trabajadores —la más
      delicada— que no tapa ningún dato.
- [x] T035 [US3] Conservar las capturas sin marca en `demos/sin-marca/`, fuera
      del repositorio, para poder regenerarlas sin pérdida.
- [x] T036 [US3] Documentar el campo `aviso` en la cabecera de `js/demos.js`,
      que es el archivo que edita el usuario, advirtiendo de su límite: no se ve
      al ampliar ni al descargar.
- [x] T037 [US3] Comprobar con 8 afirmaciones, incluida que el aviso no aparezca
      en demos que no lo declaran. Resultado: 8 de 8.
- [x] T038 [US3] Verificar contra la URL pública que se sirve la versión marcada
      y que las capturas sin marca dan 404.

---

## Fase 7: Documentación

- [x] T039 Instalar Spec Kit en el repositorio con la integración de Claude.
- [x] T040 Escribir la constitución del proyecto recogiendo las reglas que ya se
      venían siguiendo.
- [x] T041 Escribir la especificación, el plan y esta lista de tareas.
- [x] T042 Añadir `.nojekyll` para que Pages sirva los archivos tal cual y un
      Markdown no pueda tumbar la construcción del sitio.
- [x] T043 Actualizar `LEEME.md`, que describía como pendientes demos que ya
      están conectadas y no mencionaba la publicación.

---

## Pendiente

No es trabajo a medias: son decisiones que necesitan una respuesta del usuario.

- [ ] T044 Decidir si se quita el `loop` de la demo del importador. La grabación
      dura 3:32 y tiene narración; repetirla en bucle queda extraño. El
      silenciado inicial, en cambio, es obligado: los navegadores bloquean el
      autoarranque con sonido.
- [ ] T045 Corregir el contraste de los textos de 9,5–10,5 px en `--text-3` y de
      la etiqueta «en desarrollo», por debajo del nivel AA de WCAG. Ya estaba
      anotado como pendiente en `LEEME.md` antes de esta sesión. Se arregla
      oscureciendo `--text-3` en `css/estilos.css`.
- [ ] T046 Decidir qué hacer con `netlify.toml`, que ya no interviene en el
      despliegue.
- [ ] T047 Conectar las demos que siguen sin publicar: proyectos 03, 08 y los
      demás con `tipo: ""`.

## Dependencias

- La fase 1 precede a todo lo demás.
- US2, US3 y US4 son independientes entre sí: cada una se puede implementar,
  probar y desplegar por separado.
- US1 no depende técnicamente de ninguna, pero sin ella el resto no llega a nadie.
- Dentro de US4, T016 a T023 tocan tres archivos distintos y se hicieron en
  secuencia por claridad; T017 y T018 podrían haber ido en paralelo.
- La fase 6 depende de la 5: no se puede advertir sobre una galería que no existe.
