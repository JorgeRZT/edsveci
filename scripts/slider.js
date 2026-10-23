/**
 * Turns a scrollable track into a scroll-snap slider with prev/next buttons.
 * @param {Element} track The element whose children are the slides
 * @param {Object} [options]
 * @param {string} [options.label] Accessible name for the slider region
 * @returns {Element} The slider wrapper (track is moved inside it)
 */
export default function createSlider(track, { label = 'Carrusel' } = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'slider';
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-roledescription', 'carrusel');
  wrapper.setAttribute('aria-label', label);
  track.classList.add('slider-track');
  track.parentElement?.insertBefore(wrapper, track);
  wrapper.append(track);

  const nav = document.createElement('div');
  nav.className = 'slider-nav';
  nav.innerHTML = `
    <button type="button" class="slider-prev" aria-label="Anterior"></button>
    <button type="button" class="slider-next" aria-label="Siguiente"></button>`;
  wrapper.append(nav);
  const prev = nav.querySelector('.slider-prev');
  const next = nav.querySelector('.slider-next');

  const step = () => {
    const slide = track.firstElementChild;
    if (!slide) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const per = Math.max(1, Math.floor((track.clientWidth + gap) / (slide.offsetWidth + gap)));
    return per * (slide.offsetWidth + gap);
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
    wrapper.classList.toggle('slider-static', max <= 0);
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
  if (window.ResizeObserver) new ResizeObserver(update).observe(track);
  update();

  return wrapper;
}
