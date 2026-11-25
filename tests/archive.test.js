import test from 'node:test';
import assert from 'node:assert/strict';
import { selectRecords } from '../archive.js';

const records = [
  { year: 2024, names: ['Peach', 'Blossom'], president: 'Joe Biden', origin: 'Minnesota' },
  { year: 2018, names: ['Peas', 'Carrots'], president: 'Donald Trump', origin: 'South Dakota' },
  { year: 1989, names: [], president: 'George H. W. Bush', origin: 'Minnesota' },
];
test('search matches names and metadata with normalized case and whitespace', () => {
  assert.deepEqual(selectRecords(records, { query: '  BLOSSOM minnesota  ' }).map(r => r.year), [2024]);
  assert.deepEqual(selectRecords(records, { query: '1989' }).map(r => r.year), [1989]);
});
test('filters intersect and unmatched queries return an empty collection', () => {
  assert.deepEqual(selectRecords(records, { query: 'Minnesota', decade: '2020', president: 'Joe Biden' }).map(r => r.year), [2024]);
  assert.deepEqual(selectRecords(records, { decade: '2020', president: 'Donald Trump' }), []);
  assert.deepEqual(selectRecords(records, { query: '<nothing>' }), []);
});
test('reset and sorting retain all records without mutating source order', () => {
  assert.deepEqual(selectRecords(records, { sort: 'oldest' }).map(r => r.year), [1989, 2018, 2024]);
  assert.deepEqual(selectRecords(records, {}).map(r => r.year), [2024, 2018, 1989]);
  assert.deepEqual(records.map(r => r.year), [2024, 2018, 1989]);
});

test('optional image metadata failures do not hide the historical archive', async () => {
  const { loadArchive } = await import('../archive.js');
  assert.equal(typeof loadArchive, 'function');
  const result = await loadArchive(async url => {
    if (url === 'data/turkeys.json') return new Response(JSON.stringify(records));
    if (url.includes('hero')) throw new Error('Network unavailable');
    return new Response('not found', {status:404});
  });
  assert.deepEqual(result.records,records);
  assert.deepEqual(result.photos,{});
  assert.equal(result.heroPhoto,null);
});
