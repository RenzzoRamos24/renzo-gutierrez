/* =====================================================================
   sitio.js — todo el comportamiento de la página:
     1. ventana de demo
     2. apariciones al hacer scroll
     3. sección activa en el menú y barra sólida al bajar
     4. estrellas que suben en la portada
     5. lluvia de estrellas fugaces en toda la página
     6. cielo de fondo con constelaciones
   Depende de demos.js (objeto DEMOS).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. ventana de demo
     --------------------------------------------------------------- */
  var modal  = document.getElementById('modal'),
      mBody  = document.getElementById('modal-body'),
      mTitle = document.getElementById('modal-title'),
      mKind  = document.getElementById('modal-kind'),
      mNote  = document.getElementById('modal-note'),
      mLink  = document.getElementById('modal-link'),
      mFull  = document.getElementById('modal-full'),
      ultimoFoco = null;

  /* ---- pantalla completa ----
     Se pide la API nativa; si el navegador no la ofrece para elementos
     sueltos (el Safari de iPhone sólo la da en videos) se recurre a un
     respaldo con CSS que cubre la ventana. */
  var fsRespaldo = null;

  function ampliar(el) {
    if (!el) { return; }
    var pedir = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (pedir) {
      try {
        var r = pedir.call(el);
        if (r && r['catch']) { r['catch'](function () { respaldoEntrar(el); }); }
        return;
      } catch (e) {}
    }
    if (el.webkitEnterFullscreen) { try { el.webkitEnterFullscreen(); return; } catch (e) {} }
    respaldoEntrar(el);
  }

  function respaldoEntrar(el) {
    respaldoSalir();
    fsRespaldo = el;
    el.classList.add('fs-fallback');
    document.body.classList.add('fs-activo');
  }
  function respaldoSalir() {
    if (!fsRespaldo) { return; }
    fsRespaldo.classList.remove('fs-fallback');
    document.body.classList.remove('fs-activo');
    fsRespaldo = null;
  }
  function ampliado() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || fsRespaldo);
  }
  function reducir() {
    if (fsRespaldo) { respaldoSalir(); return; }
    var salir = document.exitFullscreen || document.webkitExitFullscreen;
    if (salir && (document.fullscreenElement || document.webkitFullscreenElement)) {
      try { salir.call(document); } catch (e) {}
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* al bloquear el fondo se compensa el ancho de la barra de scroll,
     si no la página da un salto lateral al abrir la ventana */
  function bloquear() {
    var ancho = window.innerWidth - document.documentElement.clientWidth;
    if (ancho > 0) { document.body.style.paddingRight = ancho + 'px'; }
    document.body.classList.add('locked');
  }
  function desbloquear() {
    document.body.classList.remove('locked');
    document.body.style.paddingRight = '';
  }

  function abrir(id) {
    var d = (typeof DEMOS !== 'undefined') ? DEMOS[id] : null;
    if (!d) { return; }

    ultimoFoco = document.activeElement;
    mTitle.textContent = d.titulo || 'Demo';
    mNote.textContent  = d.nota || '';
    mLink.hidden = true;
    mLink.removeAttribute('href');
    mFull.hidden = true;
    mBody.innerHTML = '';

    if (d.tipo === 'video' && d.src) {
      mKind.textContent = '/ grabación';
      mFull.hidden = false;
      mBody.innerHTML = '<video controls autoplay muted loop playsinline preload="metadata" src="' + esc(d.src) + '"></video>';

    } else if (d.tipo === 'sitio' && d.src) {
      mKind.textContent = '/ demo en vivo';
      /* sin loading="lazy": el iframe sólo existe cuando se abre la demo,
         diferir su carga no ahorra nada y sí la retrasa */
      mBody.innerHTML = '<iframe src="' + esc(d.src) + '" title="Demo: ' + esc(d.titulo || '') + '"></iframe>';
      mLink.href = d.src;
      mLink.hidden = false;
      vigilarIframe(mBody.querySelector('iframe'));

    } else if (d.tipo === 'fotos' && d.src && d.src.length) {
      mKind.textContent = '/ capturas';
      mFull.hidden = false;
      var h = '';
      if (d.aviso) { h += '<p class="shots-aviso">' + esc(d.aviso) + '</p>'; }
      h += '<div class="shots">';
      d.src.forEach(function (s) {
        h += '<figure><img src="' + esc(s.img) + '" alt="' + esc(s.pie || '') + '" loading="lazy">' +
             (s.pie ? '<figcaption>' + esc(s.pie) + '</figcaption>' : '') + '</figure>';
      });
      mBody.innerHTML = h + '</div>';

    } else {
      mKind.textContent = '/ demo';
      mBody.innerHTML = '<div class="pending"><b>La demo aún no está publicada.</b>' +
        '<p>Estoy preparando una versión con datos de prueba para poder mostrarla sin exponer ' +
        'información de ningún cliente. Escríbeme y te la enseño en una llamada.</p></div>';
    }

    modal.hidden = false;
    bloquear();
    modal.querySelector('.modal-x').focus();
  }

  /* si el sitio tarda o no permite verse incrustado, se avisa encima con el
     enlace a una pestaña nueva, pero la demo NO se borra: un sitio pesado en
     una conexión lenta puede tardar más y debe poder terminar de cargar.
     Cuando carga, el aviso se va solo. */
  function vigilarIframe(fr) {
    if (!fr) { return; }
    var cargo = false, aviso = null;
    fr.addEventListener('load', function () {
      cargo = true;
      if (aviso && aviso.parentNode) { aviso.parentNode.removeChild(aviso); }
    });
    setTimeout(function () {
      if (cargo || !mBody.contains(fr)) { return; }
      aviso = document.createElement('p');
      aviso.className = 'shots-aviso';
      aviso.textContent = 'La demo está tardando en cargar. Si no aparece, usa el enlace ' +
        '“abrir en pestaña nueva” de abajo.';
      mBody.insertBefore(aviso, fr);
    }, 8000);
  }

  function cerrar() {
    reducir();
    var v = mBody.querySelector('video');
    if (v) { try { v.pause(); } catch (e) {} }
    mBody.innerHTML = '';
    modal.hidden = true;
    desbloquear();
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') { ultimoFoco.focus(); }
    ultimoFoco = null;
  }

  /* el foco no se escapa de la ventana mientras está abierta */
  function focuseables() {
    var sel = 'button:not([disabled]),a[href],iframe,video[controls],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    return Array.prototype.filter.call(modal.querySelectorAll(sel), function (el) {
      return !el.hasAttribute('hidden') &&
             (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.js-demo'), function (b) {
    b.addEventListener('click', function () { abrir(b.getAttribute('data-demo')); });
  });

  modal.addEventListener('click', function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-close')) { cerrar(); }
  });

  /* el botón amplía lo que haya dentro: el video o la galería entera */
  mFull.addEventListener('click', function () {
    if (ampliado()) { reducir(); return; }
    ampliar(mBody.querySelector('video') || mBody.querySelector('.shots'));
  });

  /* y cada captura se puede ampliar por separado con un clic */
  mBody.addEventListener('click', function (e) {
    var t = e.target;
    if (fsRespaldo && (t === fsRespaldo || fsRespaldo.contains(t))) { respaldoSalir(); return; }
    if (t && t.tagName === 'IMG' && t.closest && t.closest('.shots')) { ampliar(t); }
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) { return; }
    /* estando ampliado, Escape sólo reduce; la ventana se queda abierta */
    if (e.key === 'Escape') {
      if (ampliado()) { reducir(); } else { cerrar(); }
      return;
    }
    if (e.key !== 'Tab') { return; }

    var f = focuseables();
    if (!f.length) { return; }
    var primero = f[0], ultimo = f[f.length - 1];

    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  /* ---------------------------------------------------------------
     2. apariciones al hacer scroll
     --------------------------------------------------------------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.rv');

  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(els, function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.04 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  /* ---------------------------------------------------------------
     3. sección activa en el menú y barra sólida al bajar
     --------------------------------------------------------------- */
  /* sobre la portada la barra es transparente; pasada la portada toma
     el fondo del tema para que el menú se siga leyendo */
  var nav  = document.getElementById('nav'),
      hero = document.getElementById('inicio');

  function barra() {
    if (!nav || !hero) { return; }
    var fondo = hero.getBoundingClientRect().bottom <= nav.offsetHeight;
    nav.classList.toggle('solid', fondo);
  }
  window.addEventListener('scroll', barra, { passive: true });
  window.addEventListener('resize', barra);
  barra();

  var secciones = [];
  Array.prototype.forEach.call(document.querySelectorAll('#menu a'), function (a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) !== '#') { return; }
    var el = document.getElementById(href.slice(1));
    if (el) { secciones.push({ a: a, el: el }); }
  });

  if (secciones.length) {
    var pendiente = false;

    function marcar() {
      pendiente = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var linea = y + Math.min(window.innerHeight * 0.3, 240);
      /* en la portada todavía no hay ninguna sección activa */
      var actual = null;

      for (var i = 0; i < secciones.length; i++) {
        var top = secciones[i].el.getBoundingClientRect().top + y;
        if (top <= linea) { actual = secciones[i]; }
      }
      /* al final de la página siempre gana la última sección */
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        actual = secciones[secciones.length - 1];
      }

      secciones.forEach(function (s) {
        if (s === actual) { s.a.classList.add('on'); s.a.setAttribute('aria-current', 'true'); }
        else              { s.a.classList.remove('on'); s.a.removeAttribute('aria-current'); }
      });
    }

    function pedir() {
      if (pendiente) { return; }
      pendiente = true;
      (window.requestAnimationFrame || function (f) { setTimeout(f, 60); })(marcar);
    }

    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    window.addEventListener('load', pedir);
    marcar();
  }

  /* ---------------------------------------------------------------
     4. estrellas que suben en la portada
     --------------------------------------------------------------- */
  /* Cada capa recibe una lista de sombras: cada estrella va dos veces,
     en (x, y) y en (x, y + alto), así al subir un alto completo la
     segunda copia ocupa el lugar de la primera y el bucle no se nota.
     Se calcula en píxeles con el tamaño real de la portada: en el
     celular la portada es más alta que la pantalla y con vh quedarían
     franjas sin estrellas. */
  var COLORES = ['#fff9', '#fffb', '#fffd', '#d6e2ff'];
  var CAPAS = [
    { sel: '.space-1', size: '1px', total: 200, duration: '25s' },
    { sel: '.space-2', size: '2px', total: 100, duration: '20s' },
    { sel: '.space-3', size: '4px', total: 25,  duration: '15s' }
  ];
  var anchoPrevio = 0;

  function estrellas() {
    if (!hero) { return; }
    var w = hero.clientWidth, h = hero.clientHeight;
    /* la densidad de referencia es una pantalla de 1440 × 900 */
    var escala = Math.max(0.35, (w * h) / (1440 * 900));
    anchoPrevio = w;

    CAPAS.forEach(function (c) {
      var el = hero.querySelector(c.sel);
      if (!el) { return; }
      var n = Math.round(c.total * escala), capa = [];
      for (var i = 0; i < n; i++) {
        var color = COLORES[Math.floor(Math.random() * COLORES.length)];
        var x = Math.floor(Math.random() * w), y = Math.floor(Math.random() * h);
        capa.push(x + 'px ' + y + 'px 0 ' + color, x + 'px ' + (y + h) + 'px 0 ' + color);
      }
      el.style.setProperty('--space-layer', capa.join(','));
      el.style.setProperty('--size', c.size);
      el.style.setProperty('--duration', c.duration);
      el.style.setProperty('--alto', h + 'px');
    });
  }

  estrellas();
  /* sólo se redibuja si cambia el ancho: en el celular la barra del
     navegador cambia el alto al hacer scroll y no vale la pena rehacerlo */
  window.addEventListener('resize', function () {
    if (hero && hero.clientWidth !== anchoPrevio) { estrellas(); }
  });

  /* ---------------------------------------------------------------
     5. lluvia de estrellas fugaces en toda la página
     --------------------------------------------------------------- */
  /* Las estrellas viven en coordenadas de la página, no de la pantalla: cada
     una nace en un punto de la zona que se está viendo, baja despacio en
     diagonal y se apaga; si el usuario sigue bajando, se queda donde cayó.
     Al terminar descansa unos segundos y vuelve a nacer en otro punto. */
  var lluvia = document.getElementById('lluvia');
  var reduceMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COLA = 150;

  function lanzar(el) {
    var w = lluvia.clientWidth, alto = lluvia.clientHeight;
    var vista = window.innerHeight, arriba = window.pageYOffset || document.documentElement.scrollTop || 0;
    var ang = (25 + Math.random() * 15) * Math.PI / 180;      /* 25° a 40° hacia abajo */
    var cos = Math.cos(ang), sin = Math.sin(ang);

    /* nace en la mitad izquierda y en la parte alta de lo que se está viendo */
    var x = Math.random() * w * 0.6;
    var y = arriba + Math.random() * vista * 0.55;

    /* cae entre 500 y 900 px, sin pasarse del borde derecho ni del final de la página */
    var dist = Math.min(500 + Math.random() * 400, (w - x) / cos, (alto - y) / sin) + COLA;

    /* el giro es sobre la cabeza (transform-origin a la derecha) */
    el.style.setProperty('--x', (x - COLA) + 'px');
    el.style.setProperty('--y', y + 'px');
    el.style.setProperty('--ang', ang + 'rad');
    el.style.setProperty('--dist', dist + 'px');
    /* lento: unos 110 a 160 px por segundo */
    el.style.setProperty('--dur', (dist / (110 + Math.random() * 50)).toFixed(2) + 's');

    el.classList.remove('va');
    void el.offsetWidth;                 /* reinicia la animación */
    el.classList.add('va');
  }

  if (lluvia && !reduceMov) {
    for (var k = 0; k < 7; k++) {
      (function (f) {
        f.className = 'fugaz' + (k % 3 === 0 ? ' azul' : '');
        f.addEventListener('animationend', function () {
          setTimeout(function () { lanzar(f); }, 1500 + Math.random() * 5000);
        });
        lluvia.appendChild(f);
        setTimeout(function () { lanzar(f); }, Math.random() * 9000);
      })(document.createElement('span'));
    }
  }

  /* ---------------------------------------------------------------
     6. cielo de fondo con constelaciones
     --------------------------------------------------------------- */
  /* Del final del header al final de la página: un campo de estrellas fijas
     (box-shadow, como en la portada), unas pocas que titilan y una
     constelación real por sección, alternando lados en los márgenes para no
     quedar detrás del texto. Las coordenadas de cada figura van de 0 a 1. */
  var cielo = document.getElementById('cielo');
  var FIGURAS = [
    { nombre: 'Cruz del Sur', tam: 130,
      p: [[.5,0],[.5,1],[.08,.46],[.88,.4],[.64,.62]], l: [[0,4],[4,1],[2,3]] },
    { nombre: 'Orión', tam: 170,
      p: [[.16,.04],[.76,.12],[.4,.48],[.5,.5],[.6,.53],[.26,.96],[.86,.9],[.46,.02]],
      l: [[0,7],[7,1],[0,2],[1,4],[2,3],[3,4],[2,5],[4,6]] },
    { nombre: 'Osa Mayor', tam: 190,
      p: [[0,.12],[.17,.2],[.32,.3],[.47,.4],[.52,.72],[.82,.8],[.88,.46]],
      l: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] },
    { nombre: 'Casiopea', tam: 160,
      p: [[0,.25],[.25,.8],[.5,.42],[.75,.92],[1,.18]], l: [[0,1],[1,2],[2,3],[3,4]] }
  ];
  var anchoCielo = 0;

  function sombras(n, w, h, alfaMin, alfaMax) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = (alfaMin + Math.random() * (alfaMax - alfaMin)).toFixed(2);
      out.push(Math.floor(Math.random() * w) + 'px ' + Math.floor(Math.random() * h) + 'px 0 rgba(255,255,255,' + a + ')');
    }
    return out.join(',');
  }

  function constelacion(f, x, y) {
    var t = f.tam, ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'constelacion');
    svg.setAttribute('width', t); svg.setAttribute('height', t);
    svg.style.left = x + 'px'; svg.style.top = y + 'px';
    f.l.forEach(function (l) {
      var ln = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', f.p[l[0]][0] * t); ln.setAttribute('y1', f.p[l[0]][1] * t);
      ln.setAttribute('x2', f.p[l[1]][0] * t); ln.setAttribute('y2', f.p[l[1]][1] * t);
      svg.appendChild(ln);
    });
    f.p.forEach(function (p, i) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', p[0] * t); c.setAttribute('cy', p[1] * t);
      c.setAttribute('r', i % 3 === 0 ? 2 : 1.5);
      svg.appendChild(c);
    });
    return svg;
  }

  function dibujarCielo() {
    if (!cielo) { return; }
    var arriba = hero ? hero.offsetTop + hero.offsetHeight : 0;
    cielo.style.top = arriba + 'px';
    /* el alto lo da el CSS (top a bottom del body); aquí sólo se lee */
    var w = cielo.clientWidth, h = cielo.clientHeight;
    cielo.innerHTML = '';
    anchoCielo = w;

    /* densidad: una estrella chica cada ~9.000 px² y una grande cada ~90.000 */
    var chicas = document.createElement('span'), grandes = document.createElement('span');
    chicas.className = 'campo';
    grandes.className = 'campo g';
    chicas.style.setProperty('--campo', sombras(Math.round(w * h / 9000), w, h, .15, .55));
    grandes.style.setProperty('--campo', sombras(Math.round(w * h / 90000), w, h, .4, .8));
    cielo.appendChild(chicas);
    cielo.appendChild(grandes);

    /* las que titilan */
    var nb = Math.round(w * h / 60000);
    for (var i = 0; i < nb; i++) {
      var b = document.createElement('span');
      b.className = 'brillo';
      b.style.left = Math.floor(Math.random() * w) + 'px';
      b.style.top  = Math.floor(Math.random() * h) + 'px';
      b.style.setProperty('--t', (2.5 + Math.random() * 4).toFixed(2) + 's');
      b.style.setProperty('--d', (-Math.random() * 6).toFixed(2) + 's');
      cielo.appendChild(b);
    }

    /* una constelación por sección, alternando izquierda y derecha en los
       márgenes; en pantallas angostas no hay margen y quedarían sobre el
       texto, así que ahí sólo queda el campo de estrellas */
    /* las secciones .sin-estrellas no llevan constelación */
    var secs = document.querySelectorAll('.main section:not(.hero):not(.sin-estrellas)');
    var margen = Math.max(0, (w - 1000) / 2);
    if (margen < 100) { return; }
    Array.prototype.forEach.call(secs, function (sec, k) {
      var f = FIGURAS[k % FIGURAS.length];
      var copia = { p: f.p, l: f.l, tam: Math.min(f.tam, margen - 30) };
      var izquierda = k % 2 === 0;
      var x = izquierda ? (margen - copia.tam) / 2 : w - margen + (margen - copia.tam) / 2;
      var y = sec.offsetTop - arriba + 60 + Math.random() * Math.max(0, sec.offsetHeight - copia.tam - 120);
      cielo.appendChild(constelacion(copia, x, y));
    });
  }

  dibujarCielo();
  window.addEventListener('load', dibujarCielo);
  window.addEventListener('resize', function () {
    if (cielo && cielo.clientWidth !== anchoCielo) { dibujarCielo(); }
  });
})();
