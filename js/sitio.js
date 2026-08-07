/* =====================================================================
   sitio.js — todo el comportamiento de la página:
     1. botón de modo día / noche
     2. ventana de demo
     3. apariciones al hacer scroll
     4. sección activa en el menú lateral
   Depende de tema.js (ya corrió en el <head>) y de demos.js (objeto DEMOS).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. modo día / noche
     --------------------------------------------------------------- */
  var root   = document.documentElement,
      labels = document.querySelectorAll('.js-theme-label'),
      togs   = document.querySelectorAll('.js-theme'),
      eleccionDelUsuario = !!window.__temaGuardado;

  function pintar(modo, guardar) {
    if (modo === 'dark') { root.setAttribute('data-theme', 'dark'); }
    else                 { root.removeAttribute('data-theme'); }

    Array.prototype.forEach.call(labels, function (l) {
      l.textContent = (modo === 'dark') ? 'noche' : 'día';
    });
    Array.prototype.forEach.call(togs, function (b) {
      b.setAttribute('aria-pressed', modo === 'dark' ? 'true' : 'false');
    });

    if (guardar) { try { localStorage.setItem('tema', modo); } catch (e) {} }
  }

  pintar(window.__tema || 'light', false);

  Array.prototype.forEach.call(togs, function (b) {
    b.addEventListener('click', function () {
      eleccionDelUsuario = true;
      pintar(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* mientras el usuario no elija a mano, el sitio sigue al sistema en vivo */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var alCambiar = function (e) {
      if (!eleccionDelUsuario) { pintar(e.matches ? 'dark' : 'light', false); }
    };
    if (mq.addEventListener)   { mq.addEventListener('change', alCambiar); }
    else if (mq.addListener)   { mq.addListener(alCambiar); }
  }

  /* ---------------------------------------------------------------
     2. ventana de demo
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
      mBody.innerHTML = '<iframe src="' + esc(d.src) + '" loading="lazy" title="Demo: ' + esc(d.titulo || '') + '"></iframe>';
      mLink.href = d.src;
      mLink.hidden = false;
      vigilarIframe(mBody.querySelector('iframe'));

    } else if (d.tipo === 'fotos' && d.src && d.src.length) {
      mKind.textContent = '/ capturas';
      mFull.hidden = false;
      var h = '<div class="shots">';
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

  /* si el sitio no permite verse incrustado o no responde, se avisa
     en vez de dejar un recuadro negro vacío */
  function vigilarIframe(fr) {
    if (!fr) { return; }
    var cargo = false;
    fr.addEventListener('load', function () { cargo = true; });
    setTimeout(function () {
      if (cargo || !mBody.contains(fr)) { return; }
      mBody.innerHTML = '<div class="pending"><b>No se pudo mostrar la demo aquí dentro.</b>' +
        '<p>Algunos sitios no permiten abrirse incrustados en otra página. Usa el enlace de ' +
        'abajo para verla en una pestaña nueva.</p></div>';
    }, 9000);
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
     3. apariciones al hacer scroll
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
     4. sección activa en el menú lateral
     --------------------------------------------------------------- */
  var secciones = [];
  Array.prototype.forEach.call(document.querySelectorAll('#railnav a'), function (a) {
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
      var actual = secciones[0];

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
})();
