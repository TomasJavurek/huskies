const slalom = document.querySelector('.slalom');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (slalom && !reducedMotion.matches) {
  const route = slalom.querySelector('.slalom-route');
  const trail = slalom.querySelector('.slalom-trail');
  const skier = slalom.querySelector('.slalom-skier');
  const routeLength = route.getTotalLength();
  const trailLength = 150; // Roughly two to three pole intervals.
  const segments = Array.from({length: 18}, (_, i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.style.opacity = String(0.1 + 0.68 * (i + 1) / 18);
    trail.append(path);
    return path;
  });
  const duration = 8500;
  let start;

  function clearTrail() {
    segments.forEach(segment => segment.removeAttribute('d'));
  }

  function frame(time) {
    if (reducedMotion.matches) {
      clearTrail();
      return;
    }
    if (start === undefined) start = time;
    const fraction = ((time - start) % duration) / duration;
    if (fraction < 0.88) {
      const distance = routeLength * fraction / 0.88;
      const point = route.getPointAtLength(distance);
      skier.setAttribute('cx', point.x);
      skier.setAttribute('cy', point.y);
      const beginning = Math.max(0, distance - trailLength);
      const span = distance - beginning;
      segments.forEach((segment, i) => {
        if (span < 1) { segment.removeAttribute('d'); return; }
        const from = route.getPointAtLength(beginning + span * i / segments.length);
        const middle = route.getPointAtLength(beginning + span * (i + 0.5) / segments.length);
        const to = route.getPointAtLength(beginning + span * (i + 1) / segments.length);
        segment.setAttribute('d', `M ${from.x} ${from.y} L ${middle.x} ${middle.y} L ${to.x} ${to.y}`);
      });
      skier.style.opacity = '0.8';
    } else {
      clearTrail();
      skier.style.opacity = '0';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
