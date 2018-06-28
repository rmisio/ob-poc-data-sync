export function seedToPeerId(seed) {
  const moo = seed
    .replace(/\s+/g, ',')
    .split(',')
    .map(w => w.slice(0, 4))
    .map(c => c.charCodeAt(0))
    .join('');
  return moo;
}

const words = [
  'urine',
  'cheese',
  'salamander',
  'pickles',
  'swine',
  'beaver',
  'billy',
  'fatty',
  'skipper',
  'hamper',
  'felt',
  'hat',
  'genitals',
  'pepsi',
  'traffic',
  'tyler',
  'meatballs',
  'midnight',
  'sandy',
  'corrupt',
  'blocks',
  'cardamom',
  'india',
  'fickle',
  'weiner',
  'puny',
  'silly',
  'sally',
  'wolf',
  'emerald',
  'bhoff',
  'dupa',
  'j-so-hot',
  'cathartic',
  'tyler',
  'jiggles',
  'wiggles',
];

export function generateSeed() {
  const seed = [];

  for (let i = 0; i < 10; i++) {
    seed.push(words[Math.floor(Math.random() * (words.length - 1))]);
  }

  return seed.join(' ');
}
