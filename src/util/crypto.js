import PeerId from 'peer-id';
import Base64 from 'base64-js';
import { hmac, keys } from 'libp2p-crypto';

export function identityFromKey(privKey) {
  return new Promise((resolve, reject) => {
    keys.unmarshalPrivateKey(privKey, (err, base58PrivKey) => {
      if (!err) {
        PeerId.createFromPubKey(base58PrivKey.public.bytes, (err, peerID) => {
          if (!err) {
            resolve({
              base58PrivKey: Base64.fromByteArray(base58PrivKey.bytes),
              peerId: peerID._idB58String,
            });
            return;
          }

          reject(err);
        });
        return;
      }

      reject(err);
    });
  });
}

export function identityKeyFromSeed(seed, bits = 4096) {
  const hash = 'SHA256'
  const hmacSeed = 'OpenBazaar seed';

  return new Promise((resolve, reject) => {
    hmac.create(hash, Buffer.from(hmacSeed), (err, hmac) => {
      if (!err) {
        hmac.digest(Buffer.from(seed), (err, sig) => {
          if (!err) {
            keys.generateKeyPairFromSeed('ed25519', sig, bits, (err, privKey) => {
              if (!err) {
                resolve(privKey);
              } else {
                reject(err);
              }
            });
            return;
          }

          reject(err);
        });
        return;
      }

      reject(err);
    });
  });
}

export function hashText(text, options = {}) {
  const opts = {
    hash: 'SHA256',
    hmacSeed: 'OpenBazaar seed',
    encoding: 'base64',
    ...options,
  };

  return new Promise((resolve, reject) => {
    hmac.create(opts.hash, Buffer.from(opts.hmacSeed), (err, hmac) => {
      if (!err) {
        hmac.digest(Buffer.from(text), (err, sig) => {
          if (!err) {
            resolve(sig.toString(opts.encoding));
            return;
          }

          reject(err);
        });
        return;
      }

      reject(err);
    });
  });
}