export const UNITS = Object.freeze({codepoints: 'code points', utf16: 'UTF-16 units', utf8: 'UTF-8 bytes', graphemes: 'displayed characters'});
const encoder = new TextEncoder();

export function segments(text) {
  if (typeof Intl.Segmenter !== 'function') throw new Error('This browser needs Intl.Segmenter to preserve displayed characters.');
  return [...new Intl.Segmenter('und', {granularity: 'grapheme'}).segment(text)].map(x => x.segment);
}

export function measure(text) {
  if (typeof text !== 'string') throw new TypeError('Title must be text.');
  return {codepoints: [...text].length, utf16: text.length, utf8: encoder.encode(text).length, graphemes: segments(text).length};
}

export function parseRule(unit, rawLimit) {
  if (!Object.hasOwn(UNITS, unit)) throw new Error('Choose a supported measurement unit.');
  const raw = String(rawLimit).trim();
  if (!/^[1-9]\d*$/.test(raw)) throw new Error('Enter a positive whole-number limit.');
  const limit = Number(raw);
  if (!Number.isSafeInteger(limit) || limit > 1000000) throw new Error('Use a limit between 1 and 1,000,000.');
  return {unit, limit};
}

export function analyze(title, unit, rawLimit) {
  const counts = measure(title);
  let rule;
  try { rule = parseRule(unit, rawLimit); } catch (error) { return {counts, status: 'INVALID_RULE', message: error.message, parts: []}; }
  if (!title.trim()) return {counts, rule, status: 'EMPTY_TITLE', message: 'Add a non-blank title to check.', parts: []};
  const used = counts[unit];
  let offset = 0;
  const parts = segments(title).map(text => {
    const start = offset;
    offset += measure(text)[unit];
    return {text, start, end: offset, overflow: offset > rule.limit};
  });
  return {counts, rule, used, remaining: Math.max(0, rule.limit - used), excess: Math.max(0, used - rule.limit), status: used > rule.limit ? 'OVER_LIMIT' : 'WITHIN_RULE', parts};
}

export function buildReport(title, unit, rawLimit, reference = '', observedAt = new Date().toISOString()) {
  const result = analyze(title, unit, rawLimit);
  if (!['WITHIN_RULE', 'OVER_LIMIT'].includes(result.status)) throw new Error(result.message);
  return {
    schema: 'title-rule-lab/v1', observedAt, title,
    rule: {...result.rule, reference: String(reference)}, counts: result.counts,
    result: {status: result.status, used: result.used, remaining: result.remaining, excess: result.excess},
    limits: ['The reviewer supplied the rule; no platform policy is verified.', 'The record preserves the current editor value; the app does not normalize Unicode, translate or rewrite.', 'Browser text areas normalize line endings to LF before counting.', 'Overflow shading uses whole displayed-character boundaries; exact totals use the selected unit.', 'Displayed-character segmentation follows this runtime\u2019s Intl.Segmenter version.', 'UTF-8 byte count uses TextEncoder, which replaces isolated surrogates with U+FFFD.'],
  };
}
