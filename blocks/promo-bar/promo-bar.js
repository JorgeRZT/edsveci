export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const [title, cta, note] = [...row.children];
  row.className = 'promo-bar-inner';
  title?.classList.add('promo-bar-title');
  cta?.classList.add('promo-bar-cta');
  note?.classList.add('promo-bar-note');
  if (cta && note) {
    const aside = document.createElement('div');
    aside.className = 'promo-bar-actions';
    aside.append(cta, note);
    row.append(aside);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'promo-bar-close';
  close.setAttribute('aria-label', 'Cerrar');
  row.append(close);

  // keep the bar fixed to the bottom of the viewport once its slot has scrolled past
  const wrapper = block.parentElement;
  let dismissed = false;
  close.addEventListener('click', () => {
    dismissed = true;
    block.classList.remove('promo-bar-fixed');
  });
  if (!wrapper || !window.IntersectionObserver) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && !dismissed) {
      wrapper.style.minHeight = `${entry.boundingClientRect.height}px`;
      block.classList.add('promo-bar-fixed');
    } else {
      block.classList.remove('promo-bar-fixed');
    }
  });
  observer.observe(wrapper);
}
