# Constitución del sitio de Renzo Gutiérrez

## Principios

### I. Sin compilación ni dependencias

El sitio es HTML, CSS y JavaScript planos. No hay `package.json`, ni empaquetador,
ni framework, ni paso de construcción. Se abre con doble clic y se publica
subiendo la carpeta tal cual.

Cualquier propuesta que introduzca un paso de compilación debe justificar por qué
el problema no se resuelve sin él. La ventaja que se protege es concreta: el sitio
seguirá funcionando dentro de cinco años sin reinstalar nada.

### II. Un solo archivo para configurar las demos

`js/demos.js` es el único archivo que se toca para conectar, cambiar o retirar una
demo. La clave de cada entrada coincide con el atributo `data-demo` del botón en
`index.html`.

Añadir una demo nunca debe obligar a editar `sitio.js`, `estilos.css` ni el marcado.
Si un tipo de demo nuevo lo exige, el que se amplía es el vocabulario de `demos.js`
(un campo opcional más), no el número de archivos que hay que tocar.

### III. Los datos de cliente no salen del sitio (NO NEGOCIABLE)

Ninguna demo publica información real de un cliente: ni RUCs, ni DNIs, ni nombres,
ni sueldos, ni montos.

Cuando una demo muestre datos que *parezcan* reales, la advertencia de que son
ficticios va en dos sitios: en la página y **grabada dentro de la propia imagen o
video**. El motivo es que el aviso de la página desaparece al ampliar y no acompaña
al archivo si alguien lo descarga o lo reenvía.

Antes de publicar cualquier captura o grabación hay que mirarla entera. Si aparece
un dato que podría ser real, se pregunta antes de subir, no después.

### IV. Degradar con dignidad

Cada función asume que el navegador puede no tener lo que necesita, y responde con
algo utilizable en vez de romperse:

- Sin JavaScript → `css/sin-js.css` mantiene la página legible.
- Sin pantalla completa por elemento (Safari de iPhone) → respaldo en CSS.
- Sitio incrustado que no permite el iframe → aviso y enlace a pestaña nueva.
- Sin `IntersectionObserver` o con movimiento reducido → todo visible de golpe.

### V. Verificar antes de afirmar

Nada se da por terminado porque «debería funcionar». Se comprueba y se enseña la
comprobación:

- El JavaScript pasa `node --check`.
- El comportamiento se prueba en un navegador de verdad, en modo headless, con
  afirmaciones que fallan de forma visible.
- Lo publicado se verifica contra la URL pública, no contra el disco local.
- Los archivos de prueba se borran antes de confirmar los cambios.

Si algo no se pudo comprobar, se dice cuál es el hueco en lugar de callarlo.

## Accesibilidad y peso

La ventana de demo mantiene el foco atrapado mientras está abierta, se cierra con
`Escape` y devuelve el foco al botón que la abrió. Toda imagen lleva texto
alternativo; en las galerías, el pie de foto cumple esa función.

Los archivos multimedia se sirven comprimidos. Una grabación de pantalla de tres
minutos no debe pasar de unos pocos megabytes: el visitante no espera una descarga
para ver una demo de treinta segundos.

Pendiente reconocido: los textos de 9,5–10,5 px en `--text-3` y la etiqueta «en
desarrollo» quedan por debajo del contraste AA de WCAG. No se corrigió para no
alterar la paleta; se arregla oscureciendo `--text-3` en `css/estilos.css`.

## Publicación

El sitio vive en GitHub Pages, servido desde la rama `main` del repositorio
`RenzzoRamos24/renzo-gutierrez`. Publicar es hacer `git push`; no hay más pasos.

Lo que no se publica se declara en `.gitignore` y se conserva en local: el video
sin comprimir y las capturas sin marca de agua.

Publicar es una acción hacia fuera. Se hace con autorización explícita, y una vez
hecho se comprueba que la URL pública sirve lo que se esperaba.

## Gobernanza

Esta constitución manda sobre la costumbre. Cuando un cambio la contradiga, se
documenta el porqué en el plan de la funcionalidad, en el apartado de complejidad.

**Versión**: 1.0.0 | **Ratificada**: 2026-08-07 | **Última enmienda**: 2026-08-07
