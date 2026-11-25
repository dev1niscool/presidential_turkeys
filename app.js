import { selectRecords, loadArchive } from './archive.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const state = { query: '', decade: 'all', president: 'all', sort: 'newest' };
let records = [], photos = {}, heroYear = 2024, priorFocus;
const title = record => record.names.length ? record.names.join(' & ') : 'An unnamed guest';
const fallback = '<div class="no-photo"><img src="assets/favicon.svg" alt=""><p>From the archives</p><small>Photograph not yet located</small></div>';
function imageMarkup(record, profile = false) {
  const photo = photos[record.year];
  return photo ? `<img ${profile ? 'class="profile-photo"' : 'loading="lazy"'} src="${escape(photo.src)}" alt="${escape(photo.alt)}" width="${profile ? 860 : 600}" height="${profile ? 360 : 430}">` : fallback;
}
function handleBrokenImages(root) {
  root.querySelectorAll('img').forEach(img => {
    const replaceBroken = () => {
    if (img.getAttribute('src') !== 'assets/favicon.svg') {
      const placeholder = document.createElement('div');
      placeholder.innerHTML = fallback.replace('Photograph not yet located', 'Photograph temporarily unavailable');
      img.replaceWith(placeholder.firstElementChild);
    }
    };
    img.addEventListener('error', replaceBroken, {once:true});
    if (img.complete && !img.naturalWidth) replaceBroken();
  });
}
function render() {
  const visible = selectRecords(records, state);
  $('#archive').innerHTML = visible.map(record => `<article class="turkey-card"><a class="card-link" href="#year-${record.year}" aria-label="Meet ${escape(title(record))}, ${record.year}"><div class="card-image">${imageMarkup(record)}<span class="card-year">${record.year}</span></div><div class="card-body"><p class="card-president">${escape(record.president)}</p><h3>${escape(title(record))}</h3><div class="card-meta"><span>${escape((record.origin || 'Origin not recorded').split(' — ')[0])}</span><span>Meet the ${record.names.length > 1 ? 'pair' : 'turkey'}</span></div></div></a></article>`).join('');
  $('#result-count').textContent = `${visible.length} of ${records.length} years`;
  $('#empty').hidden = visible.length !== 0;
  handleBrokenImages($('#archive'));
}
function updateHash() {
  const match = location.hash.match(/^#year-(\d{4})$/);
  const record = match && records.find(record => record.year === Number(match[1]));
  if (record) openProfile(record);
  else if ($('#profile').open) $('#profile').close();
}
function openProfile(record) {
  const photo = photos[record.year];
  if (!$('#profile').open) priorFocus = document.activeElement;
  const date = record.date ? new Date(`${record.date}T12:00:00Z`).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}) : 'Date not recorded';
  const older = records.find(r => r.year === record.year - 1), newer = records.find(r => r.year === record.year + 1);
  $('#profile-content').innerHTML = `${imageMarkup(record, true)}${photo ? `<p class="profile-credit">${escape(photo.credit)} · ${escape(photo.license)} · <a href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer">Image source</a></p>` : ''}<div class="profile-copy"><p class="eyebrow">THE PRESIDENTIAL PARDON · ${record.year}</p><h2 id="profile-title">${escape(title(record))}</h2><p class="profile-president">Pardoned by President ${escape(record.president)}</p><p class="profile-fact">${escape(record.fact)}</p><dl class="profile-fields"><div><dt>Pardon day</dt><dd>${escape(date)}</dd></div><div><dt>Home state / origin</dt><dd>${escape(record.origin || 'Not recorded')}</dd></div><div><dt>Life after the White House</dt><dd>${escape(record.retirement || 'Not recorded')}</dd></div><div><dt>The guest list</dt><dd>${escape(record.names.length ? record.names.join(' and ') : 'Names not preserved in the sources')}</dd></div></dl>${record.note ? `<p class="profile-note">Archive note: ${escape(record.note)}</p>` : ''}<div class="profile-sources"><h3>Sources & further reading</h3>${record.sources.map(source => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a>`).join('')}</div><div class="profile-bottom">${older ? `<a href="#year-${older.year}">Previous year · ${older.year}</a>` : '<span></span>'}${newer ? `<a href="#year-${newer.year}">Next year · ${newer.year}</a>` : '<span></span>'}<a href="#collection">Back to the collection</a></div></div>`;
  handleBrokenImages($('#profile-content'));
  if (!$('#profile').open) $('#profile').showModal();
  $('#profile').scrollTop = 0;
  $('.dialog-close').focus();
}
function closeProfile() {
  if (/^#year-/.test(location.hash)) history.replaceState(null, '', `${location.pathname}${location.search}#collection`);
  $('#profile').close();
}
$('#profile').addEventListener('cancel', event => { event.preventDefault(); closeProfile(); });
$('.dialog-close').addEventListener('click', closeProfile);
$('#profile').addEventListener('close', () => { if (priorFocus?.isConnected) priorFocus.focus({preventScroll:true}); });
$('#profile').addEventListener('click', event => { if (event.target === $('#profile')) { const rect = $('#profile').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProfile(); } });
$('#filters').addEventListener('submit', event => event.preventDefault());
$('#search').addEventListener('input', event => { state.query = event.target.value; render(); });
$('#president').addEventListener('change', event => { state.president = event.target.value; render(); });
$('#sort').addEventListener('change', event => { state.sort = event.target.value; render(); });
function setDecade(value) { state.decade = value; document.querySelectorAll('[data-decade]').forEach(button => { const active = button.dataset.decade === value; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); }); }
document.querySelectorAll('[data-decade]').forEach(button => button.addEventListener('click', () => { setDecade(button.dataset.decade); render(); }));
$('#reset').addEventListener('click', () => { $('#filters').reset(); Object.assign(state,{query:'',president:'all',sort:'newest'}); setDecade('all'); render(); $('#search').focus(); });
$('#surprise').addEventListener('click', () => { if (records.length) location.hash = `year-${records[Math.floor(Math.random() * records.length)].year}`; });
$('#hero-details').addEventListener('click', () => { location.hash = `year-${heroYear}`; });
window.addEventListener('hashchange', updateHash);
async function start() {
  try {
    const loaded = await loadArchive();
    ({records, photos} = loaded);
    const {heroPhoto} = loaded;
    records.sort((a,b) => b.year-a.year);
    for (const president of [...new Set(records.map(r => r.president))]) { const option = document.createElement('option'); option.value = president; option.textContent = president; $('#president').append(option); }
    heroYear = 2024;
    const hero = records.find(record => record.year === heroYear), photo = heroPhoto;
    if (hero && photo) { const heroImage = $('#hero-photo'); if (heroImage) { heroImage.src = photo.src; heroImage.alt = photo.alt; } $('#hero-caption').innerHTML = `${heroYear} · ${escape(title(hero))} · <a href="${escape(photo.source)}" target="_blank" rel="noopener noreferrer">Photo credit</a>`; }
    $('#year-count').textContent = records.length;
    $('#year-span').textContent = `${records.at(-1).year}–${records[0].year}`;
    $('#coverage-end').textContent = records[0].year;
    render(); updateHash();
  } catch (error) { $('#result-count').textContent = 'Archive unavailable'; $('#load-error').hidden = false; $('#surprise').disabled = true; $('#hero-details').disabled = true; console.error(error); }
}
handleBrokenImages($('.hero-photo'));
start();
