import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const records = JSON.parse(fs.readFileSync(new URL('../data/turkeys.json',import.meta.url)));
const photos = JSON.parse(fs.readFileSync(new URL('../assets/photos/manifest.json',import.meta.url)));
test('archive covers each formal annual pardon without duplicate years', () => {
  assert.deepEqual(records.map(r=>r.year).sort((a,b)=>a-b),Array.from({length:38},(_,i)=>1989+i));
  for (const record of records) {
    assert.ok(record.president && record.fact && record.origin && record.retirement, `Missing record detail for ${record.year}`);
    assert.ok(record.sources.length > 0, `Missing source for ${record.year}`);
    for (const source of record.sources) assert.equal(new URL(source.url).protocol,'https:');
    assert.ok(Array.isArray(record.names));
    assert.ok(!record.names.some(name=>/unnamed/i.test(name)), 'Unknowns must not be presented as names');
  }
});
test('every photo has a real local image, identity and provenance', () => {
  for (const [year,photo] of Object.entries(photos)) {
    assert.ok(records.some(record=>record.year===Number(year)));
    assert.ok(photo.alt && photo.credit && photo.source && photo.license);
    const bytes=fs.readFileSync(new URL('../'+photo.src,import.meta.url));
    assert.equal(bytes[0],0xff,`Missing JPEG signature for ${year}`);
    assert.equal(bytes[1],0xd8);
    assert.ok(bytes.length>2000);
  }
});
