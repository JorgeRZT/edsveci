/**
 * Lightweight variant switcher for running experiments (preview/localhost only).
 * Reloads the page with ?experiment=<id>/<variant> to force a variant.
 * @param {Array} experiments window.hlx.experiments
 */
export default function showExperimentPill(experiments) {
  const list = (experiments || []).filter((e) => e?.config?.variants);
  if (!list.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'experiment-pill';
  list.forEach(({ config }) => {
    const current = config.selectedVariant || 'control';
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = `A/B ${config.label.replace(/^Experiment /, '')}: ${config.variants[current]?.label || current}`;
    details.append(summary);

    const ul = document.createElement('ul');
    config.variantNames.forEach((name) => {
      const variant = config.variants[name];
      const split = variant.percentageSplit ? `${Math.round(Number(variant.percentageSplit) * 100)}%` : '';
      const url = new URL(window.location.href);
      url.searchParams.set('experiment', `${config.id}/${name}`);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url.toString();
      a.textContent = `${variant.label} ${split}`.trim();
      if (name === current) a.setAttribute('aria-current', 'true');
      li.append(a);
      ul.append(li);
    });
    details.append(ul);
    wrapper.append(details);
  });
  document.body.append(wrapper);
}
