const slalom = document.querySelector('.slalom');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (slalom && !reducedMotion.matches) {
  const route = slalom.querySelector('.slalom-route');
  const trail = slalom.querySelector('.slalom-trail');
  const skier = slalom.querySelector('.slalom-skier');
  const routeLength = route.getTotalLength();
  const trailLength = 130; // Roughly two to three pole intervals.
  const duration = 8500;
  let start;

  function frame(time) {
    if (reducedMotion.matches) {
      trail.removeAttribute('d');
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
      const steps = Math.max(2, Math.ceil((distance - beginning) / 5));
      const points = Array.from({length: steps + 1}, (_, i) => route.getPointAtLength(beginning + (distance - beginning) * i / steps));
      trail.setAttribute('d', points.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
      skier.style.opacity = '0.8';
    } else {
      trail.removeAttribute('d');
      skier.style.opacity = '0';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
