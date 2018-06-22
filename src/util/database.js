function seedToPeerId(seed`) {
  return seed
    .replace(/\s/g, '')
    .split('')
    .map(c => c.charCodeAt(0))
    .join('');
}

let dbPromise = null;

async function _connect(seed) {
  if (typeof seed !== 'string' || !seed.replace(/\s/g, '')) {
    throw new Error('Please provide a seed as a non-empty string.');
  }

  try {
    db = await RxDB.create(
      {
        name: seedToPeerId(seed),
        adapter: 'idb',
        password: seed.replace(/\s/g, ''),
      }
    );
  } catch (err) {
    console.error('There was an error connecting to the db.');
    throw err;
  }
}

export function connect(seed) {
  if (!dbPromise) dbPromise = _connect();
  return dbPromise;
}