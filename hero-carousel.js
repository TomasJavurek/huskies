const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const tear = document.createElement('img');
  tear.className = 'hero-tear';
  tear.alt = '';
  tear.setAttribute('aria-hidden', 'true');
  carousel.append(tear);
  tear.addEventListener('animationend', () => carousel.classList.remove('signal-slip'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let photos = [...document.querySelectorAll('.gallery img')].map(img => ({obrazok: img.getAttribute('src'), popis: img.alt}));
  let current = 0;
  let active = 0;
  let rotationTimer;
  let signalTimers = [];

  const galleryOnly = new Set([
    'images/ski-3.jpg',
    'images/uploads/julka_alps.jpg',
    'images/uploads/jullka_hola.jpg',
    'images/uploads/maco.jpg',
  ]);
  const heroPhotos = items => items.filter(item => {
    if (typeof item?.obrazok !== 'string') return false;
    const path = item.obrazok.replace(/^\//, '');
    return path.startsWith('images/') && !galleryOnly.has(path);
  });
  photos = heroPhotos(photos);

  function scheduleRotation() {
    clearTimeout(rotationTimer);
    signalTimers.forEach(timer => clearTimeout(timer));
    signalTimers = [];
    if (reducedMotion.matches || photos.length < 2) return;

    const displayTime = 5000;
    const firstPossibleSlip = 900;
    const minimumGap = 750;
    const latestStart = displayTime - minimumGap;
    const count = 1 + Math.floor(Math.random() * 3);
    const randomWindow = latestStart - firstPossibleSlip - (count - 1) * minimumGap;
    // Space the randomized starts so each animation has time to finish.
    const starts = Array.from({ length: count }, () => Math.random() * randomWindow);
    starts.sort((a, b) => a - b);
    signalTimers = starts.map((delay, index) =>
      setTimeout(playSignalSlip, firstPossibleSlip + delay + index * minimumGap)
    );
    rotationTimer = setTimeout(rotate, displayTime);
  }

  function playSignalSlip() {
    if (reducedMotion.matches || document.hidden || carousel.classList.contains('signal-slip')) return;
    const slide = slides[active];
    tear.src = slide.src;
    tear.style.transform = getComputedStyle(slide).transform;
    carousel.classList.add('signal-slip');
  }

  function show(index, attempts = 0) {
    if (attempts >= photos.length) return;
    const photo = photos[index];
    const preload = new Image();
    preload.onload = () => {
      if (reducedMotion.matches) return;
      const next = 1 - active;
      slides[next].src = photo.obrazok;
      slides[next].alt = photo.popis || 'Fotografia z klubu huSKIes';
      slides[next].setAttribute('aria-hidden', 'false');
      slides[active].setAttribute('aria-hidden', 'true');
      slides[next].classList.add('is-active');
      slides[active].classList.remove('is-active');
      active = next;
      current = index;
      scheduleRotation();
    };
    preload.onerror = () => show((index + 1) % photos.length, attempts + 1);
    preload.src = photo.obrazok;
  }

  function rotate() {
    show((current + 1) % photos.length);
  }

  function resetPhotos(items) {
    const list = heroPhotos(items);
    if (!list.length) return;
    photos = list;
    current = 0;
    slides[active].src = photos[0].obrazok;
    slides[active].alt = photos[0].popis || 'Fotografia z klubu huSKIes';
    scheduleRotation();
  }

  // Load the CMS data directly; the carousel continues with the HTML images if it is unavailable.
  fetch('content/site.json', { cache: 'no-cache' }).then(response => {
    if (!response.ok) throw new Error('Gallery data unavailable');
    return response.json();
  }).then(content => resetPhotos(content.obrazky?.galeria || [])).catch(() => {});
  document.addEventListener('huskies:gallery', event => resetPhotos(event.detail || []));
  reducedMotion.addEventListener('change', () => {
    carousel.classList.remove('signal-slip');
    scheduleRotation();
  });
  scheduleRotation();
}
