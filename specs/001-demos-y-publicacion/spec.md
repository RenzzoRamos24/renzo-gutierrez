# Especificación: Demos verificables y publicación del sitio

**Rama**: `main` (el trabajo ya está entregado y en producción)

**Creada**: 2026-08-07

**Estado**: Implementado

**Entrada**: Peticiones del usuario a lo largo de la sesión del 2026-08-07:
«guardé el video de concar importar para que lo pongas en la demo» ·
«aún no se subió a mi sitio web, por qué?» ·
«hay forma de subir mi web para que se pueda ver en la web?» ·
«cuando es video o foto tiene que haber una opción para expandir a pantalla
completa» · «te acabo de poner fotos de nexplanilla, necesito que esos en la
demo» · «ponle ahí que los datos son ficticios para proteger la
confidencialidad del cliente».

## Escenarios de uso y pruebas *(obligatorio)*

### US1 — El portafolio existe en internet (Prioridad: P1)

Renzo comparte un enlace con un cliente potencial y esa persona abre el sitio en
su navegador, sin instalar nada y sin que Renzo tenga que mandar archivos.

**Por qué esta prioridad**: sin esto, ninguna de las demás historias tiene valor.
Un portafolio en `file:///C:/...` solo lo ve su autor. Todo lo demás son mejoras
sobre algo que ya se puede enseñar.

**Prueba independiente**: pedir la URL pública desde una máquina cualquiera y
comprobar que responde con la página, sin credenciales.

**Escenarios de aceptación**:

1. **Dado** que el sitio está publicado, **cuando** alguien abre la URL pública,
   **entonces** recibe la página con código 200 y contenido `text/html`.
2. **Dado** un cambio confirmado en la rama `main`, **cuando** se hace `git push`,
   **entonces** el sitio se reconstruye solo y sirve la versión nueva en unos
   minutos, sin ningún paso manual.

---

### US2 — Ver el importador a CONCAR funcionando (Prioridad: P2)

Un visitante entra al proyecto 02 y quiere comprobar que la carga masiva existe
de verdad, no solo como afirmación en un texto.

**Por qué esta prioridad**: es el proyecto con resultado más medible del
portafolio (3.000 documentos en cinco minutos) y era la petición original.

**Prueba independiente**: abrir la demo del proyecto 02 y ver la grabación
reproducirse dentro de la ventana, sin salir del sitio.

**Escenarios de aceptación**:

1. **Dado** el proyecto 02, **cuando** se pulsa «ver demo», **entonces** se abre
   la ventana con la grabación y controles de reproducción.
2. **Dado** un visitante con conexión corriente, **cuando** carga la demo,
   **entonces** el video empieza sin una espera larga de descarga.
3. **Dado** que la ventana se cierra, **cuando** el video estaba reproduciéndose,
   **entonces** se detiene y no sigue sonando de fondo.

---

### US3 — Ver Nexplanilla sin exponer a ningún cliente (Prioridad: P3)

Un visitante recorre las pantallas de la aplicación de planillas. Los datos que
ve son de planilla —nombres, DNIs, sueldos— y necesita quedar claro, sin lugar a
duda, que ninguno pertenece a una persona real.

**Por qué esta prioridad**: enseña un proyecto en desarrollo que aún no tiene URL
pública. El riesgo no es técnico sino de confidencialidad, y es el que gobierna
la solución.

**Prueba independiente**: abrir la demo del proyecto 07, recorrer las cinco
capturas y comprobar que la advertencia de datos ficticios es visible tanto en la
galería como dentro de cada imagen.

**Escenarios de aceptación**:

1. **Dado** el proyecto 07, **cuando** se pulsa «ver demo», **entonces** se ven
   cinco capturas en el orden del recorrido real de la aplicación.
2. **Dado** que la galería está abierta, **cuando** el visitante la mira,
   **entonces** hay un aviso destacado encima que declara los datos ficticios.
3. **Dado** que el visitante amplía una captura o se la descarga, **cuando** la
   observa fuera de la página, **entonces** la advertencia sigue presente porque
   está grabada en la imagen.

---

### US4 — Ampliar cualquier demo a pantalla completa (Prioridad: P4)

Un visitante quiere leer el detalle de una captura o ver la grabación en grande,
sin quedar limitado al tamaño de la ventana de demo.

**Por qué esta prioridad**: mejora la lectura de lo que ya se puede ver. El video
traía el control nativo del navegador, aunque enterrado en la barra de
reproducción; las capturas no tenían ninguna forma de ampliarse.

**Prueba independiente**: abrir cualquier demo de video o de fotos, pulsar
«ampliar» y comprobar que el contenido ocupa la pantalla.

**Escenarios de aceptación**:

1. **Dado** una demo de video o de fotos, **cuando** se abre la ventana,
   **entonces** aparece el botón «ampliar» en la cabecera.
2. **Dado** una demo de tipo sitio o una demo sin publicar, **cuando** se abre la
   ventana, **entonces** el botón no aparece, porque no hay nada que ampliar.
3. **Dado** una galería de capturas, **cuando** se pulsa una foto concreta,
   **entonces** esa foto se amplía sola.
4. **Dado** un contenido ampliado, **cuando** se pulsa `Escape`, **entonces** se
   reduce y la ventana de demo sigue abierta; un segundo `Escape` la cierra.

### Casos límite

- **El navegador no permite pantalla completa por elemento.** El Safari de iPhone
  solo la ofrece en elementos `video`, así que las capturas se quedarían sin
  nada. Se recurre a un respaldo en CSS que cubre la ventana.
- **Alguien descarga una captura y la reenvía.** El aviso de la página no viaja
  con el archivo. Por eso la advertencia va también grabada en el píxel.
- **El archivo de video supera el límite de la plataforma.** GitHub rechaza
  archivos de más de 100 MB en un `push`. La grabación original ocupaba 164 MB.
- **La ventana se cierra estando ampliado.** Debe salirse de pantalla completa
  antes de cerrar, o la página queda bloqueada con el fondo inutilizable.
- **Una demo no declara aviso.** El recuadro no debe aparecer ni dejar hueco.
- **Un sitio incrustado no permite mostrarse en un iframe.** Comportamiento que
  ya existía: se avisa y se ofrece abrirlo en una pestaña nueva.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El sitio DEBE estar accesible en una URL pública por HTTPS, sin
  credenciales.
- **FR-002**: Publicar una actualización DEBE consistir únicamente en confirmar y
  empujar a `main`; no puede haber pasos manuales de copia de archivos.
- **FR-003**: El sistema DEBE reproducir demos de tipo video dentro de la ventana,
  con controles y sin abandonar la página.
- **FR-004**: El sistema DEBE detener la reproducción al cerrar la ventana.
- **FR-005**: Las grabaciones publicadas DEBEN estar comprimidas de forma que no
  penalicen la carga, conservando legible el texto de la interfaz grabada.
- **FR-006**: El sistema DEBE mostrar demos de tipo fotos como una galería con
  pie de foto, y ese pie DEBE servir además de texto alternativo.
- **FR-007**: El sistema DEBE ofrecer un control de pantalla completa en las
  demos de video y de fotos, y DEBE ocultarlo en los demás tipos.
- **FR-008**: Los usuarios DEBEN poder ampliar una captura concreta pulsando
  sobre ella.
- **FR-009**: Estando ampliado, `Escape` DEBE reducir sin cerrar la ventana.
- **FR-010**: Cerrar la ventana DEBE salir de pantalla completa y dejar la página
  utilizable.
- **FR-011**: El sistema DEBE funcionar en navegadores sin pantalla completa por
  elemento, mediante un respaldo equivalente.
- **FR-012**: Una demo DEBE poder declarar un aviso que se muestre destacado
  encima de sus capturas.
- **FR-013**: Toda captura con datos que aparenten ser reales DEBE llevar la
  advertencia grabada dentro de la imagen.
- **FR-014**: Los originales sin comprimir y sin marca DEBEN conservarse en local
  y quedar fuera del repositorio.
- **FR-015**: Conectar una demo nueva DEBE requerir editar únicamente
  `js/demos.js`.

### Entidades

- **Demo**: una entrada de `js/demos.js`, identificada por la clave que comparte
  con el atributo `data-demo` de su botón. Campos: `titulo`, `tipo`
  (`video` · `sitio` · `fotos` · vacío), `src` (ruta, URL o lista de capturas),
  `nota` y `aviso` (opcional, solo galerías).
- **Captura**: elemento de la lista `src` de una demo de fotos. Campos: `img`
  (ruta) y `pie` (descripción, que actúa también de texto alternativo).

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: La URL pública devuelve código 200 para la página, la hoja de
  estilos, el guion y todos los archivos multimedia referenciados.
- **SC-002**: La grabación publicada pesa menos de 10 MB conservando resolución y
  duración originales. *(Resultado: 6,9 MB desde 164 MB, 24 veces menos.)*
- **SC-003**: El texto de la interfaz grabada sigue siendo legible tras comprimir,
  comprobado comparando un fotograma antes y después.
- **SC-004**: Publicar un cambio no requiere ninguna acción fuera de `git push`.
- **SC-005**: El comportamiento de pantalla completa pasa el 100 % de las
  comprobaciones automáticas. *(Resultado: 14 de 14.)*
- **SC-006**: La galería y su aviso pasan el 100 % de sus comprobaciones.
  *(Resultado: 8 de 8.)*
- **SC-007**: La advertencia de datos ficticios sigue siendo visible cuando la
  imagen se separa de la página.
- **SC-008**: Los originales sin marca no son accesibles desde la URL pública
  *(comprobado: 404)*.

## Supuestos

- Los datos de las capturas de Nexplanilla son inventados. El usuario lo confirmó
  al pedir que se etiquetaran como ficticios; la etiqueta solo protege si el dato
  realmente lo es.
- El repositorio es público. Se aceptó a cambio de no necesitar cuentas nuevas:
  `gh` ya estaba autenticado como `RenzzoRamos24`.
- El visitante llega con un navegador de escritorio o móvil actual. Los
  navegadores sin `Element.requestFullscreen` se atienden con el respaldo, no con
  paridad completa.
- Las versiones sin marca de agua siguen en el historial del repositorio, en el
  commit anterior a la marca. Es aceptable porque los datos son ficticios; con
  datos reales habría que tratar el historial, no solo los archivos.
- El video de la demo se reproduce silenciado y en bucle. Los navegadores
  bloquean el autoarranque con sonido, así que silenciado es obligado; el bucle
  queda como decisión pendiente de revisar en una grabación narrada de 3:32.
