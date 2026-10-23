import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOCOMPLETE = {
  nombre: 'given-name',
  'primer apellido': 'family-name',
  teléfono: 'tel',
  email: 'email',
  'código postal': 'postal-code',
};

function toId(text, i) {
  return `lead-${i}-${text.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function createField(labelText, type, optionsCell, index) {
  const required = labelText.endsWith('*');
  const name = labelText.replace(/\*$/, '').trim();
  const id = toId(name, index);
  const wrapper = document.createElement('div');
  wrapper.className = `lead-form-field lead-form-type-${type}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;

  let input;
  if (type === 'select') {
    input = document.createElement('select');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecciona';
    input.append(placeholder);
    optionsCell?.querySelectorAll('li').forEach((li) => {
      const option = document.createElement('option');
      option.textContent = li.textContent.trim();
      input.append(option);
    });
  } else {
    input = document.createElement('input');
    input.type = ['text', 'tel', 'email'].includes(type) ? type : 'text';
    const ac = AUTOCOMPLETE[name.toLowerCase()];
    if (ac) input.autocomplete = ac;
  }
  input.id = id;
  input.name = id;
  input.required = required;
  wrapper.append(label, input);
  return wrapper;
}

export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'lead-form-image';
  const intro = document.createElement('div');
  intro.className = 'lead-form-text';
  const card = document.createElement('div');
  card.className = 'lead-form-card';
  const form = document.createElement('form');
  const fields = document.createElement('div');
  fields.className = 'lead-form-fields';
  const note = document.createElement('div');
  note.className = 'lead-form-note';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button';
  submit.textContent = 'Enviar';

  [...block.children].forEach((row, i) => {
    const [keyCell, valueCell, extraCell] = [...row.children];
    const key = keyCell?.textContent.trim() || '';
    const k = key.toLowerCase();
    if (k === 'image') {
      const img = valueCell?.querySelector('img');
      if (img) media.append(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 900px)', width: '2000' }, { width: '750' }]));
    } else if (k === 'text') {
      intro.append(...valueCell.childNodes);
    } else if (k === 'title') {
      card.append(...valueCell.childNodes);
    } else if (k === 'note') {
      note.append(...valueCell.childNodes);
    } else if (k === 'submit') {
      submit.textContent = valueCell?.textContent.trim() || submit.textContent;
    } else if (key && valueCell) {
      fields.append(createField(key, valueCell.textContent.trim().toLowerCase(), extraCell, i));
    }
  });

  const status = document.createElement('p');
  status.className = 'lead-form-status';
  status.setAttribute('role', 'status');

  form.append(fields, note, submit, status);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.reset();
    status.textContent = '¡Gracias! Un agente experto se pondrá en contacto contigo muy pronto.';
  });
  card.append(form);

  const content = document.createElement('div');
  content.className = 'lead-form-content';
  content.append(intro, card);
  block.replaceChildren(media, content);
}
