import {
  connect,
  destroy,
  getCurDb,
} from 'util/database';
import {
  hashText,
  identityKeyFromSeed,
  identityFromKey,
  decrypt,
  encrypt,
} from 'util/crypto';
import { base64ToHex } from 'util/textEncode';

// action const
// todo: namespace into an object or seperate file?
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

const loggedOut = () => {
  return {
    type: LOGGED_OUT,
  }
};

export const logout = () => {
  // todo: only logout if logged in
  return function (dispatch, getState) {
    const userState = getState().user;

    // todo: cancel in-flight logins...?
    if (!(userState.loggedIn || userState.loggingIn)) return;
    destroy();
    localStorage.setItem('sessionLogout', userState.peerId);
    localStorage.removeItem('sessionLogout');
    dispatch(loggedOut({
      peerId: userState.peerId,
    }));
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

export const login = seed => {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  return async dispatch => {
    dispatch({
      type: LOGGING_IN,
    });

    let login;

    try {
      login = await _login(seed);

      dispatch({
        type: LOGGED_IN,
        peerId: login.peerId,
        seed,
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
      encryptedSeed.split('|');

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

    return login(decryptedSeed)(dispatch);
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

  // TODO: put protection on the database that only allows a single profile
  return async dispatch => {
    const db = getCurDb();

    if (!db) {
      const error = new Error('There is no database connection.');

      dispatch({
        type: SAVE_PROFILE_ERROR,
        peerId: profile.peerID,
        error,
      });

      return;
    }

    dispatch({
      type: SAVING_PROFILE,
      peerId: profile.peerID,
    });

    try {
      const profileDoc = await db.instance.profiles.upsert(profile);
    } catch (error) {
      dispatch({
        type: SAVE_PROFILE_ERROR,
        peerId: profile.peerID,
        error,
      });
      return;
    }

    dispatch({
      type: SAVE_PROFILE_SAVED,
      peerId: profile.peerID,
    });
  };
}

export const validatePassphrase = passphrase => {
  const errors = [];

  if (!passphrase || passphrase.replace(/\s/g, '').length < 8) {
    errors.push('The passphrase must be at least 8 characters long, not counting spaces.');
  }

  return errors.length ? errors : null;
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
        encryptedSeed: encrypted && `${encrypted.result}|${encrypted.nonce}`,
      });

      // TODO: unsubscribe on logout
      profile.$.subscribe(p => {
        if (!p) return;
        dispatch(profileSet(login.peerId, p));
      });
    } catch (e) {
      dispatch({
        type: REGISTER_ERROR,
        peerId: (login && login.peerId) || undefined,
        error: e,
      });
    }
  }
};

export const requestSessionLogin = () => {
  return function(dispatch, getState) {
    const userState = getState().user;
    window.addEventListener('storage',
      e => {
        if (e.key === 'sessionLogin') {
          // another tab is logged in
          if (e.newValue && !userState.loggedIn &&
            !userState.loggingIn && !userState.registering) {
            dispatch(login(e.newValue));
          }
        }
      },
      false
    );
    localStorage.setItem('getSessionLogin', 'blah');
    localStorage.removeItem('getSessionLogin');
  }  
}

let listeningForSessionLoginRequests = false;

export const listenForSessionLoginEvents = () => (dispatch, getState) => {
  if (listeningForSessionLoginRequests) return;

  window.addEventListener('storage', e => {
    const userState = getState().user || {};

    if (e.key === 'getSessionLogin') {
      // another tab asked for the sessionStorage -> send it
      const sessionLogin = sessionStorage.getItem('sessionLogin');

      if (sessionLogin) {
        localStorage.setItem('sessionLogin', sessionStorage.getItem('sessionLogin'));
      }

      // the other tab should now have it, so we're done with it.
      localStorage.removeItem('sessionLogin'); // <- could do short timeout as well.      
    } else if (e.key === 'sessionLogout' && userState.peerId === e.newValue) {
      dispatch(logout());
    }
  }, false);

  listeningForSessionLoginRequests = true;
}