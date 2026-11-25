export function selectRecords(records, { query = '', decade = 'all', president = 'all', sort = 'newest' } = {}) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return records.filter(record => {
    const text = [record.year, ...record.names, record.president, record.origin].join(' ').toLocaleLowerCase();
    return words.every(word => text.includes(word))
      && (decade === 'all' || Math.floor(record.year / 10) * 10 === Number(decade))
      && (president === 'all' || record.president === president);
  }).sort((a, b) => sort === 'oldest' ? a.year - b.year : b.year - a.year);
}

export async function loadArchive(fetcher = fetch) {
  async function getJson(url) {
    const response = await fetcher(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    return response.json();
  }
  const [records, photos, heroPhoto] = await Promise.all([
    getJson('data/turkeys.json'),
    getJson('assets/photos/manifest.json').catch(() => ({})),
    getJson('assets/photos/hero.json').catch(() => null),
  ]);
  return { records, photos, heroPhoto };
}
