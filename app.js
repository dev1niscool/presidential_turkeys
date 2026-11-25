import { selectRecords, loadArchive } from './archive.js';
import { squarePosition, portraitPosition } from './portraits.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const state = { query: '', decade: 'all' };
let records = [], photos = {}, heroPhoto = null, selectedYear = 2024, priorFocus;
const title = record => record.names.length ? record.names.join(' & ') : 'Unnamed';
const photoFor = record => record.year === 2024 && heroPhoto ? heroPhoto : photos[record.year];
const placeholder = (label = 'No photograph') => `<div class="no-photo"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M29 44C13 48 9 36 14 30c-4-10 3-17 10-13 1-11 14-11 16-1 9-5 16 4 10 12 10 5 5 18-7 17M19 24l12 14m2-23 1 22m12-14L37 38M16 35l14 7"/><path d="M29 45c-1-11 8-13 11-8 3-8 1-16 5-18 6-3 9 5 4 7l-1 9c4 15-7 18-15 14m3 0-1 7m9-8 1 8m-13 0h6m4 0h6m2-34 5 2-6 2"/></svg><span>${label}</span></div>`;

function imageMarkup(record, mode = 'card') {
  const photo = photoFor(record);
  if (!photo) return placeholder();
  const position = (mode === 'card' ? squarePosition : portraitPosition)[record.year] ?? 50;
  return `<img ${mode === 'profile' ? 'class="profile-photo"' : ''} src="${escape(photo.src)}" alt="${escape(photo.alt)}" style="object-position:${position}% 50%" ${mode === 'card' ? 'loading="lazy" decoding="async"' : ''}>`;
}

function handleBrokenImages(root) {
  root.querySelectorAll('img').forEach(img => {
    const replaceBroken = () => { const box = document.createElement('div'); box.innerHTML = placeholder('Photo unavailable'); img.replaceWith(box.firstElementChild); };
    img.addEventListener('error', replaceBroken, {once:true});
    if (img.complete && !img.naturalWidth) replaceBroken();
  });
}

function selectYear(year) {
  const record = records.find(record => record.year === year);
  if (!record) return;
  selectedYear = year;
  $('#selection-name').textContent = title(record);
  $('#selection-year').textContent = record.year;
  $('#selection-president').textContent = record.president;
  $('#selection-photo').innerHTML = imageMarkup(record, 'preview');
  $('#selection-photo').href = `#year-${year}`;
  $('#selection-photo').setAttribute('aria-label', `View ${title(record)}, ${year}`);
  $('#selection-open').href = `#year-${year}`;
  document.querySelectorAll('.card-link').forEach(card => {
    const active = Number(card.dataset.year) === year;
    card.classList.toggle('is-selected', active);
    if (active) card.setAttribute('aria-current', 'true'); else card.removeAttribute('aria-current');
  });
  handleBrokenImages($('#selection-photo'));
}

function render() {
  const visible = selectRecords(records, state);
  $('#archive').innerHTML = visible.map(record => `<article class="turkey-card"><a class="card-link" data-year="${record.year}" href="#year-${record.year}" title="${escape(title(record))}" aria-label="${escape(title(record))}, ${record.year}">${imageMarkup(record)}<span class="card-year">${record.year}</span></a></article>`).join('');
  $('#result-count').textContent = `${visible.length} of ${records.length} years`;
  $('#empty').hidden = visible.length !== 0;
  $('.selection').classList.toggle('unavailable', visible.length === 0);
  $('.selection').inert = visible.length === 0;
  if (visible.length) selectYear(visible.some(record => record.year === selectedYear) ? selectedYear : visible[0].year);
  handleBrokenImages($('#archive'));
}

function updateHash() {
  const match = location.hash.match(/^#year-(\d{4})$/);
  const record = match && records.find(record => record.year === Number(match[1]));
  if (record) { selectYear(record.year); openProfile(record); }
  else if ($('#profile').open) $('#profile').close();
}

function openProfile(record) {
  const photo = photoFor(record);
  if (!$('#profile').open) priorFocus = document.activeElement;
  const date = record.date ? new Date(`${record.date}T12:00:00Z`).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}) : 'Not recorded';
  const older = records.find(r => r.year === record.year - 1), newer = records.find(r => r.year === record.year + 1);
  $('#profile-content').innerHTML = `<div class="profile-layout"><div class="profile-visual">${imageMarkup(record, 'profile')}</div><div class="profile-copy"><p class="profile-year">${record.year}</p><h2 id="profile-title">${escape(title(record))}</h2><p class="profile-president">${escape(record.president)}</p><p class="profile-fact">${escape(record.fact)}</p><dl class="profile-fields"><div><dt>Pardoned</dt><dd>${escape(date)}</dd></div><div><dt>From</dt><dd>${escape(record.origin || 'Not recorded')}</dd></div><div><dt>Retired to</dt><dd>${escape(record.retirement || 'Not recorded')}</dd></div></dl><details class="profile-sources"><summary>Sources & credits</summary>${record.note ? `<p class="profile-note">${escape(record.note)}</p>` : ''}${record.sources.map(source => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a>`).join('')}${photo ? `<p class="profile-credit">${escape(photo.credit)} · ${escape(photo.license)}. <a href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer">Photo source</a></p>` : ''}</details><div class="profile-bottom">${older ? `<a href="#year-${older.year}">Previous · ${older.year}</a>` : '<span></span>'}${newer ? `<a href="#year-${newer.year}">Next · ${newer.year}</a>` : '<span></span>'}</div></div></div>`;
  handleBrokenImages($('#profile-content'));
  if (!$('#profile').open) $('#profile').showModal();
  $('#profile').scrollTop = 0;
  $('.dialog-close').focus();
}

function closeProfile() {
  if (/^#year-/.test(location.hash)) history.replaceState(null, '', `${location.pathname}${location.search}#collection`);
  $('#profile').close();
}

$('#archive').addEventListener('pointerover', event => {
  if (event.pointerType === 'touch') return;
  const card = event.target.closest('.card-link');
  if (card && Number(card.dataset.year) !== selectedYear) selectYear(Number(card.dataset.year));
});
$('#archive').addEventListener('focusin', event => { const card = event.target.closest('.card-link'); if (card) selectYear(Number(card.dataset.year)); });
$('#archive').addEventListener('keydown', event => {
  const card = event.target.closest('.card-link');
  if (!card || !['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const cards = [...$('#archive').querySelectorAll('.card-link')];
  const columns = getComputedStyle($('#archive')).gridTemplateColumns.split(' ').length;
  const index = cards.indexOf(card);
  const offset = {ArrowRight:1,ArrowLeft:-1,ArrowDown:columns,ArrowUp:-columns};
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0,Math.min(cards.length - 1,index + offset[event.key]));
  cards[next]?.focus();
});
$('#profile').addEventListener('cancel', event => { event.preventDefault(); closeProfile(); });
$('.dialog-close').addEventListener('click', closeProfile);
$('#profile').addEventListener('close', () => { if (priorFocus?.isConnected) priorFocus.focus({preventScroll:true}); });
$('#profile').addEventListener('click', event => { if (event.target === $('#profile')) { const rect = $('#profile').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProfile(); } });
$('#filters').addEventListener('submit', event => event.preventDefault());
$('#search').addEventListener('input', event => { state.query = event.target.value; render(); });
function setDecade(value) { state.decade = value; document.querySelectorAll('[data-decade]').forEach(button => { const active = button.dataset.decade === value; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }); }
document.querySelectorAll('[data-decade]').forEach(button => button.addEventListener('click', () => { setDecade(button.dataset.decade); render(); }));
$('#reset').addEventListener('click', () => { $('#filters').reset(); state.query = ''; setDecade('all'); render(); $('#search').focus(); });
window.addEventListener('hashchange', updateHash);

async function start() {
  try {
    ({records, photos, heroPhoto} = await loadArchive());
    records.sort((a,b) => b.year-a.year);
    $('#year-span').textContent = `${records.at(-1).year}–${records[0].year}`;
    render(); updateHash();
  } catch (error) { $('#result-count').textContent = 'Archive unavailable'; $('#load-error').hidden = false; console.error(error); }
}
handleBrokenImages($('#selection-photo'));
start();
