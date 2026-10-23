import createSlider from '../../scripts/slider.js';

function decorateMedia(container, label) {
  const pictures = [...container.querySelectorAll(':scope > p > picture, :scope > picture')];
  if (pictures.length > 1) {
    const list = document.createElement('ul');
    list.className = 'info-carousel';
    const first = pictures[0].parentElement.tagName === 'P' ? pictures[0].parentElement : pictures[0];
    first.before(list);
    pictures.forEach((pic) => {
      const holder = pic.parentElement.tagName === 'P' ? pic.parentElement : null;
      const li = document.createElement('li');
      li.append(pic);
      list.append(li);
      if (holder && !holder.textContent.trim() && !holder.children.length) holder.remove();
    });
    createSlider(list, { label });
  } else if (pictures.length === 1) {
    const holder = pictures[0].parentElement;
    if (holder.tagName === 'P') holder.classList.add('info-figure');
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  const title = document.createElement('div');
  title.className = 'info-title';
  const body = document.createElement('div');
  body.className = 'info-body';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    if (i === 0 && cells.length === 1 && cells[0].querySelector('h1, h2')) {
      title.append(...cells[0].childNodes);
    } else if (cells.length >= 2) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const heading = cells[0].querySelector('h2, h3, h4') || cells[0];
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      if (heading.id) h.id = heading.id;
      summary.append(h);
      const content = document.createElement('div');
      content.className = 'info-panel';
      content.append(...cells[1].childNodes);
      decorateMedia(content, h.textContent);
      details.append(summary, content);
      body.append(details);
    } else if (cells[0]) {
      const intro = document.createElement('div');
      intro.className = 'info-intro';
      intro.append(...cells[0].childNodes);
      const heading = intro.querySelector('h3');
      decorateMedia(intro, heading ? heading.textContent.trim() : 'Imágenes');
      body.append(intro);
    }
  });

  block.replaceChildren(title, body);
}
