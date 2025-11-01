// Intro (once per browser session, + dev override), hidden-colour hover accent, modal niceties
(function () {
  /* ---------------- 1) INTRO CONTROL ----------------
     - Plays once per BROWSER SESSION using sessionStorage
     - Add ?intro=1 to the URL to force the intro on demand
  --------------------------------------------------- */
  const params = new URLSearchParams(location.search);
  const forceIntro = params.get('intro') === '1';
  const INTRO_KEY = 'zypherIntroSeen_session'; // session-scoped

  try {
    const intro = document.getElementById('zypher-intro');
    const seenThisSession = sessionStorage.getItem(INTRO_KEY) === '1';

    if (!intro) {
      // Nothing to do if the markup isn't present
    } else if (forceIntro) {
      // Force show: clear session flag so intro plays now
      sessionStorage.removeItem(INTRO_KEY);
      intro.addEventListener('animationend', (e) => {
        if (e.animationName === 'intro-fade') {
          sessionStorage.setItem(INTRO_KEY, '1');
          intro.remove();
        }
      });
    } else if (seenThisSession) {
      // Already seen this session → remove immediately
      intro.remove();
      document.body.classList.add('no-intro');
    } else {
      // First load this session → play, then mark as seen
      intro.addEventListener('animationend', (e) => {
        if (e.animationName === 'intro-fade') {
          sessionStorage.setItem(INTRO_KEY, '1');
          intro.remove();
        }
      });
    }
  } catch (_) {
    /* ignore storage errors; intro will show normally */
  }

  /* --------------- 2) HIDDEN-COLOUR HOVER --------------- */
  const root = document.documentElement;
  const defaultAccent = getComputedStyle(root).getPropertyValue('--mint').trim();
  const setAccent = (hex) => root.style.setProperty('--accent', hex);
  const resetAccent = () => root.style.setProperty('--accent', defaultAccent);

  document.querySelectorAll('.card').forEach((card) => {
    const col = card.getAttribute('data-accent') || defaultAccent;
    card.addEventListener('mouseenter', () => setAccent(col));
    card.addEventListener('focusin', () => setAccent(col));
    card.addEventListener('mouseleave', resetAccent);
    card.addEventListener('focusout', resetAccent);
  });

  // If a modal is opened via #hash, sync the accent to its trigger colour
  function applyHashAccent() {
    if (!location.hash) return resetAccent();
    const trigger = document.querySelector(`a[href="${location.hash}"]`);
    const col = trigger?.getAttribute('data-accent') || defaultAccent;
    setAccent(col);
  }
  if (location.hash) applyHashAccent();
  window.addEventListener('hashchange', applyHashAccent);

  /* ---------------- 3) MODAL UX HELPERS ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && location.hash) {
      history.pushState('', document.title, location.pathname + location.search);
      resetAccent();
    }
  });
  document.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal && e.target === modal) {
      e.preventDefault();
      history.pushState('', document.title, location.pathname + location.search);
      resetAccent();
    }
  });
})();
