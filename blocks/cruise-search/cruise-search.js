let uid = 0;

export default function decorate(block) {
  uid += 1;
  const tabs = document.createElement('div');
  tabs.className = 'cruise-search-tabs';
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', 'Tipo de crucero');
  const fields = document.createElement('div');
  fields.className = 'cruise-search-fields';
  const footer = document.createElement('div');
  footer.className = 'cruise-search-footer';
  let submit;
  let count;
  let reset;

  [...block.children].forEach((row, i) => {
    const [keyCell, valueCell] = [...row.children];
    const key = keyCell?.textContent.trim() || '';
    const k = key.toLowerCase();
    if (k === 'tabs') {
      valueCell.querySelectorAll('li').forEach((li, j) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = li.textContent.trim();
        btn.setAttribute('aria-pressed', j === 0 ? 'true' : 'false');
        btn.addEventListener('click', () => {
          tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
        });
        tabs.append(btn);
      });
    } else if (k === 'submit') {
      submit = valueCell.querySelector('a');
      if (submit) {
        submit.className = 'button';
        submit.parentElement?.classList.remove('button-container');
      }
    } else if (k === 'count') {
      count = document.createElement('p');
      count.className = 'cruise-search-count';
      count.append(...valueCell.childNodes);
    } else if (k === 'reset') {
      reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'cruise-search-reset';
      reset.textContent = valueCell.textContent.trim();
    } else if (key) {
      const id = `cruise-search-${uid}-${i}`;
      const field = document.createElement('div');
      field.className = 'cruise-search-field';
      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = key;
      const select = document.createElement('select');
      select.id = id;
      const option = document.createElement('option');
      option.textContent = valueCell?.textContent.trim() || '';
      select.append(option);
      field.append(label, select);
      fields.append(field);
    }
  });

  if (submit) fields.append(submit);
  if (count) footer.append(count);
  if (reset) {
    reset.addEventListener('click', () => {
      fields.querySelectorAll('select').forEach((s) => { s.selectedIndex = 0; });
    });
    footer.append(reset);
  }
  const panel = document.createElement('div');
  panel.className = 'cruise-search-panel';
  panel.append(fields, footer);
  block.replaceChildren(tabs, panel);
}
