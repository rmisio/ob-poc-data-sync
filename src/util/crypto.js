import PeerId from 'peer-id';
import Base64 from 'base64-js';
import { hmac, keys } from 'libp2p-crypto';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export function identityFromKey(privKey) {
  return new Promise((resolve, reject) => {
    keys.unmarshalPrivateKey(privKey, (err, base58PrivKey) => {
      if (!err) {
        PeerId.createFromPubKey(base58PrivKey.public.bytes, (err, peerID) => {
          if (!err) {
            resolve({
              base58PrivKey: Base64.fromByteArray(base58PrivKey.bytes),
              peerId: peerID._idB58String
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
  return new Promise((resolve, reject) => {
    hash(seed, {
      hmacSeed: 'ob-identity'
    }).then(
      sig => {
        keys.generateKeyPairFromSeed('ed25519', sig, bits, (err, privKey) => {
          if (!err) {
            resolve(privKey);
          } else {
            reject(err);
          }
        });
      },
      e => reject(e)
    );
  });
}

/*
 * Returns a Uint8Array(64) hash of the given text.
 */
export const hash = async (text, options = {}) => {
  const opts = {
    hash: 'SHA256',
    hmacSeed: 'ob-hash',
    ...options
  };

  return new Promise((resolve, reject) => {
    hmac.create(opts.hash, naclUtil.decodeUTF8(opts.hmacSeed), (err, hmac) => {
      if (!err) {
        hmac.digest(naclUtil.decodeUTF8(text), (err, sig) => {
          if (!err) {
            resolve(sig);
            return;
          }

          reject(err);
        });
        return;
      }

      reject(err);
    });
  });
};

/*
 * Returns a base64 encoded hash of the given text.
 */
export const hashText = async (text, options = {}) => {
  const opts = {
    hash: 'SHA256',
    hmacSeed: 'ob-hash-text',
    ...options
  };

  const uint8Hash = await hash(text, {
    hash: opts.hash,
    hmacSeed: opts.hmacSeed
  });

  return naclUtil.encodeBase64(uint8Hash);
};

/*
 * Will encrypt the given text using the given passphrase. You will be
 * returned the resulting encrypted text along with a nonce. Those two
 * things + the passphrase will be needed to decrypt the text.
 */
export const encrypt = async (text, passphrase, options = {}) => {
  if (typeof text !== 'string' || !text) {
    throw new Error('Please provide some text to encrypt as a string.');
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new Error('Please provide a passphrase as a string.');
  }

  // The default hash and hmacSeed should match the defaults in decrypt().
  const opts = {
    hash: 'SHA256',
    hmacSeed: 'ob-encrypt',
    ...options
  };

  let nonce = await hash(text, {
    hash: opts.hash,
    hmacSeed: opts.hmacSeed
  });
  nonce = nonce.slice(0, 24);

  const key = await hash(passphrase, {
    hash: opts.hash,
    hmacSeed: opts.hmacSeed
  });

  const encrypted = nacl.secretbox(naclUtil.decodeUTF8(text), nonce, key);

  return {
    result: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce)
  };
};

/*
 * Will decrypt the given encryptedText using the given nonce and passphrase.
 * The same hash and/or hmacSeed used when encrypting, must be used here. If
 * the wrong passphrase is provided, null will be returned.
 */
export const decrypt = async (
  encryptedText,
  nonce,
  passphrase,
  options = {}
) => {
  if (typeof encryptedText !== 'string' || !encryptedText) {
    throw new Error('Please provide some encryptedText to decrypt.');
  }

  if (typeof nonce !== 'string' || !nonce) {
    throw new Error('Please provide a nonce as a string.');
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new Error('Please provide a passphrase as a string.');
  }

  // The default hash and hmacSeed should match the defaults in encrypt().
  const opts = {
    hash: 'SHA256',
    hmacSeed: 'ob-encrypt',
    ...options
  };

  const key = await hash(passphrase, {
    hash: opts.hash,
    hmacSeed: opts.hmacSeed
  });

  const decrypted = nacl.secretbox.open(
    naclUtil.decodeBase64(encryptedText),
    naclUtil.decodeBase64(nonce),
    key
  );

  return decrypted === null ? null : naclUtil.encodeUTF8(decrypted);
};
