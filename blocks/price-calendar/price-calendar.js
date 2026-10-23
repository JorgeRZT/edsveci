const VISIBLE_ROWS = 5;

export default function decorate(block) {
  const [headRow, ...rows] = [...block.children];
  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.className = 'sr-only';
  caption.textContent = 'Precios por naviera y mes de salida';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const htr = document.createElement('tr');
  [...headRow.children].forEach((cell, i) => {
    const th = document.createElement('th');
    th.scope = 'col';
    if (i === 0) {
      th.innerHTML = '<span class="sr-only">Naviera</span>';
    } else {
      const [year, month] = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim());
      th.innerHTML = `<span class="price-calendar-year">${year || ''}</span> <span class="price-calendar-month">${month || cell.textContent.trim()}</span>`;
    }
    htr.append(th);
  });
  thead.append(htr);

  rows.forEach((row, r) => {
    const tr = document.createElement('tr');
    if (r >= VISIBLE_ROWS) tr.className = 'price-calendar-extra';
    [...row.children].forEach((cell, i) => {
      if (i === 0) {
        const th = document.createElement('th');
        th.scope = 'row';
        th.append(...cell.childNodes);
        tr.append(th);
        return;
      }
      const td = document.createElement('td');
      const link = cell.querySelector('a');
      if (link) {
        link.className = '';
        link.closest('.button-container')?.classList.remove('button-container');
        if (cell.querySelector('strong')) td.className = 'price-calendar-best';
        const label = document.createElement('span');
        label.className = 'price-calendar-from';
        label.textContent = 'desde';
        link.prepend(label);
        td.append(link);
      } else {
        td.className = 'price-calendar-empty';
        td.innerHTML = '<span class="sr-only">No disponible</span>';
      }
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(caption, thead, tbody);
  const scroller = document.createElement('div');
  scroller.className = 'price-calendar-scroller';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', caption.textContent);
  scroller.append(table);
  block.replaceChildren(scroller);

  if (rows.length > VISIBLE_ROWS) {
    tbody.id = `price-calendar-body-${document.querySelectorAll('.price-calendar').length}`;
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'secondary price-calendar-more';
    more.setAttribute('aria-controls', tbody.id);
    more.setAttribute('aria-expanded', 'false');
    more.textContent = 'Ver más';
    more.addEventListener('click', () => {
      const expanded = block.classList.toggle('expanded');
      more.setAttribute('aria-expanded', expanded);
      more.textContent = expanded ? 'Ver menos' : 'Ver más';
    });
    block.append(more);
  }
}
