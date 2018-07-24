import { connect, destroy } from 'util/database';
import {
  hashText,
  identityKeyFromSeed,
  identityFromKey,
  decrypt,
  encrypt,
} from 'util/crypto';
import { base64ToHex } from 'util/textEncode';

export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGING_IN = 'LOGGING_IN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const PROFILE_SET = 'PROFILE_SET';
export const SAVING_PROFILE = 'SAVING_PROFILE';
export const SAVE_PROFILE_SAVED = 'SAVE_PROFILE_SAVED';
export const SAVE_PROFILE_ERROR = 'SAVE_PROFILE_ERROR';
export const REGISTERING = 'REGISTERING';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const LS_LOGIN_SET = 'LS_LOGIN_SET';

export const LOGIN_TYPE_SEED = 'LOGIN_TYPE_SEED';
export const LOGIN_TYPE_PASSWORD = 'LOGIN_TYPE_PASSWORD';

const SEED_NONCE_SEPARATOR = '||==||';

const loggedOut = () => {
  return {
    type: LOGGED_OUT,
  }
};

export const logout = () => {
  sessionStorage.setItem('login', 'explicit-logout');

  return function (dispatch) {
    destroy();
    dispatch(loggedOut());
  };
};

const profileSet = (peerId, profile = {}) => ({
  type: PROFILE_SET,
  peerId,
  profile,
});

const _login = async seed => {
  const dbNameBase64 = await hashText(seed, { encoding: 'hex' });
  const dbName = base64ToHex(dbNameBase64);
  const edd2519PrivateKey = await identityKeyFromSeed(seed);
  const { peerId } = await identityFromKey(edd2519PrivateKey.bytes);
  const pw = await hashText(seed, {
    encoding: 'hex',
    hmacSeed: 'ob-db-password-seed',
  });
  const db = await connect(dbName, pw);

  return {
    db,
    name: dbName,
    pw,
    peerId,
  };
};

export const login = (seed) => {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  return async function (dispatch) {
    dispatch({
      type: LOGGING_IN,
    });

    let login;
    try {
      login = await _login(seed);
      sessionStorage.setItem('login', login.pw);
      dispatch({
        type: LOGGED_IN,
        peerId: login.peerId,
      });

      // todo: unsubcribe on logout
      await login.db.profiles
        .findOne(login.peerId)
        .$.subscribe(profile => {
          if (!profile) return;
          dispatch(profileSet(login.peerId, profile.toJSON()));
        });
    } catch (e) {
      console.error(e);
      dispatch({
        type: LOGIN_ERROR,
        peerId: (login && login.peerId) || undefined,
        error: e,
      });
    }
  }
};

export const loginViaPassword = (encryptedSeed, passphrase) => {
  if (typeof encryptedSeed !== 'string' || !encryptedSeed) {
    throw new Error('Please provide an encrypted seed.');
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new Error('Please provide a password.');
  }

  return async function (dispatch) {
    dispatch({
      type: LOGGING_IN,
    });

    const splitEncryptedSeed =
      encryptedSeed.split(SEED_NONCE_SEPARATOR);

    if (splitEncryptedSeed.length !== 2) {
      dispatch({
        type: LOGIN_ERROR,
        error:
          new Error('The encrypted seed is not in the correct format.'),
      });
      return;
    }

    const seed = splitEncryptedSeed[0];
    const nonce = splitEncryptedSeed[1];
    const decryptedSeed = await decrypt(seed, nonce, passphrase);

    if (decryptedSeed === null) {
      dispatch({
        type: LOGIN_ERROR,
        error:
          new Error('Unable to decrypt the seed. Invalid password.'),
      });
      return;
    }

    login(decryptedSeed)(dispatch);
  }
}

const firstNames = [
  'Sam',
  'Mike',
  'Josh',
  'Jeff',
  'Jason',
  'Brian',
  'Jenn',
  'Monique',
  'Chris',
  'Tyler',
  'Justin',
  'Washington',
];

const lastNames = [
  'Patt-Trump',
  'Greenie',
  'Wolf',
  'Jeffryes',
  'Joshryes',
  'Hoteling',
  'Hoffenschlagen',
  'Cloud',
  'Pacia',
  'Smithsonian',
  'Drake',
  'Sanchez',
];

export const saveProfile = (profile = {}) => {
  if (typeof profile.peerID !== 'string' || !profile.peerID) {
    throw new Error('The profile must have a peerID as a string.');
  }

  // TODO: async/await this
  // TODO: put protection on the database that only allows a single profile
  return function (dispatch) {
    return new Promise(
      (resolve, reject) => {
        dispatch({
          type: SAVING_PROFILE,
          peerId: profile.peerID,
        });

        return connect(profile.peerID)
          .then(
            db => {
              const profileDoc = db.profiles.upsert(profile)
                .then(
                  () => {
                    resolve(profileDoc);
                    dispatch({
                      type: SAVE_PROFILE_SAVED,
                      peerId: profile.peerID,
                    });                    
                  },
                  e => {
                    console.error(e);
                    dispatch({
                      type: SAVE_PROFILE_ERROR,
                      peerId: profile.peerID,
                      error: e,
                    });
                    reject(e);
                  },
                );
            },
            e => {
              console.error(e);
              dispatch({
                type: SAVE_PROFILE_ERROR,
                peerId: profile.peerID,
                error: e,
              });
            }
          );
      }
    );
  };
}

export const validatePassphrase = passphrase => {
  const errors = [];

  if (!passphrase || passphrase.replace(/\s/g, '').length < 8) {
    errors.push('The passphrase must be at least 8 characters long, not counting spaces.');
  }

  console.dir(errors.length ? errors : null);
  return errors.length ? errors : null;
}

/*
 * Returns the current lsLogin setting from the user state tree. You are required
 * to provide the state, so you will almost certainly be calling this method from
 * within a thunk.
 */
const getLsLogin = async state => {
  if (typeof state === 'null' || typeof state !== 'object') {
    throw new Error('Please provide the state as an object.');
  }

  const { user: { lsLogin } } = state;
  return  lsLogin;
}

export const register = (seed, passphrase) => {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  if (passphrase && typeof passphrase !== 'string') {
    throw new Error('If providing a passphrase, it must be a string.')
  }

  return async function (dispatch, getState) {
    dispatch({
      type: REGISTERING,
      loginType: passphrase ? LOGIN_TYPE_PASSWORD : LOGIN_TYPE_SEED,
    });  

    if (passphrase) {
      const passphraseErrs = validatePassphrase(passphrase);

      if (passphraseErrs) {
        return {
          type: REGISTER_ERROR,
          error: new Error(passphraseErrs.join(', ')),
        };
      }
    }

    let login;

    try {
      let encrypted = null;

      if (passphrase) {
        encrypted = await encrypt(seed, passphrase);
      }

      login = await _login(seed);
      const firstName = firstNames[Math.floor(Math.random() * (firstNames.length - 1))];
      const lastName = lastNames[Math.floor(Math.random() * (lastNames.length - 1))];      
      const profile = await login.db.profiles.upsert({
        peerID: login.peerId,
        name: `${firstName} ${lastName}`,
        description: 'I like puppy dogs, rainbows and ice cream cones, but not necessarily in that order. 🐾 🌈 🍦',
        avatarUrl: `http://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
      });

      dispatch({
        type: LOGGED_IN,
        peerId: login.peerId,
        profile: profile.toJSON(),
        seed,
        encryptedSeed: encrypted,
      });

      sessionStorage.setItem('login', login.pw);

      // TODO: unsubscribe on logout
      profile.$.subscribe(p => {
        if (!p) return;
        dispatch(profileSet(login.peerId, p));
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: REGISTER_ERROR,
        peerId: (login && login.peerId) || undefined,
        error: e,
      });
    }
  }
};
