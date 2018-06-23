export function seedToPeerId(seed) {
  return seed
    .replace(/\s/g, '')
    .split('')
    .map(c => c.charCodeAt(0))
    .join('');
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
];

export function generateSeed() {
  const seed = [];

  for (let i = 0; i < 10; i++) {
    seed.push(words[Math.floor(Math.random() * (words.length - 1))]);
  }

  return seed.join(' ');
}
