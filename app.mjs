import {UNITS, analyze, buildReport} from './measurement.mjs';
const $ = id => document.getElementById(id);
const title = $('title'), unit = $('unit'), limit = $('limit'), reference = $('reference');
let current = null;

function invalidateExport() {
  $('download').hidden = true;
  $('download').removeAttribute('href');
  $('report-panel').hidden = true;
  $('report-panel').open = false;
  $('report-json').textContent = '';
  $('export-note').textContent = 'The record preserves your exact title and the rule you entered.';
}

function render() {
  invalidateExport();
  $('input-size').textContent = `${title.value.length.toLocaleString('en-US')} / 2,000`;
  $('preview').replaceChildren();
  let result;
  try { result = analyze(title.value, unit.value, limit.value); }
  catch (error) { current = null; $('status-box').className = 'status over'; $('status-label').textContent = 'Browser requirement'; $('status-detail').textContent = error.message; $('build-report').disabled = true; return; }
  current = result;
  for (const key of Object.keys(UNITS)) {
    $('count-' + key).textContent = result.counts[key].toLocaleString('en-US');
    document.querySelector(`[data-metric="${key}"]`).classList.toggle('selected', key === unit.value);
  }
  const valid = ['WITHIN_RULE', 'OVER_LIMIT'].includes(result.status);
  $('build-report').disabled = !valid;
  $('status-box').className = 'status ' + (result.status === 'WITHIN_RULE' ? 'good' : result.status === 'OVER_LIMIT' ? 'over' : 'neutral');
  $('status-label').textContent = result.status === 'WITHIN_RULE' ? 'Within your rule' : result.status === 'OVER_LIMIT' ? `Over by ${result.excess} ${UNITS[unit.value]}` : result.status === 'EMPTY_TITLE' ? 'Add a title' : 'Enter your rule';
  $('status-detail').textContent = valid ? `${result.used} / ${result.rule.limit} ${UNITS[unit.value]} · ${result.remaining} remaining. This checks your entered rule only.` : result.message;
  $('preview').classList.toggle('placeholder', !title.value);
  if (result.parts.length) for (const part of result.parts) { const node = document.createElement(part.overflow ? 'mark' : 'span'); node.textContent = part.text; $('preview').append(node); }
  else $('preview').textContent = title.value || 'Your exact title appears here.';
}

for (const input of [title, unit, limit, reference]) input.addEventListener('input', render);
$('emoji-demo').addEventListener('click', () => { title.value = 'Cup 👨‍👩‍👧‍👦'; limit.value = '12'; unit.value = 'codepoints'; reference.value = 'Demonstration rule — not a marketplace policy'; $('demo-note').textContent = 'Illustrative text and a made-up 12-unit limit. Switch to UTF-16 to see the difference.'; render(); });
$('thai-demo').addEventListener('click', () => { title.value = 'แก้วน้ำ'; limit.value = '5'; unit.value = 'graphemes'; reference.value = 'Demonstration rule — not a marketplace policy'; $('demo-note').textContent = 'Illustrative Thai text and a made-up 5-unit limit. Try code points next.'; render(); });
$('clear').addEventListener('click', () => { title.value = ''; limit.value = ''; reference.value = ''; $('demo-note').textContent = 'Demo limits are illustrative, never marketplace policies.'; render(); title.focus(); });
$('build-report').addEventListener('click', () => {
  if (!current || !['WITHIN_RULE', 'OVER_LIMIT'].includes(current.status)) return;
  const report = buildReport(title.value, unit.value, limit.value, reference.value);
  const serialized = JSON.stringify(report, null, 2) + '\n';
  $('report-json').textContent = serialized;
  $('report-panel').hidden = false;
  $('report-panel').open = true;
  $('download').href = '/export?report=' + encodeURIComponent(serialized);
  $('download').hidden = false;
  $('export-note').textContent = 'Current record prepared. Editing any input clears this export.';
});
render();
