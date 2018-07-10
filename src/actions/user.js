import { connect, destroy } from 'util/database';
import { hashText } from 'util/crypto'; // todo: Bye 2 the Bye'rs
import {
  identityKeyFromSeed,
  identityFromKey,
} from 'util/crypto';

function loggedOut() {
  return {
    type: 'loggedOut',
  }
};

export function logout() {
  sessionStorage.setItem('login', 'explicit-logout');

  return function (dispatch) {
    destroy();
    dispatch(loggedOut());
  };
};

function profileSet(peerId, profile = {}) {
  return {
    type: 'profileSet',
    peerId,
    profile,
  };
}

async function _login(dispatch, seed) {
  const dbName = await hashText(seed, { encoding: 'hex' });
  const edd2519PrivateKey = await identityKeyFromSeed(seed);
  const { peerId } = await identityFromKey(edd2519PrivateKey.bytes);
  const pw = await hashText(seed, {
    encoding: 'hex',
    hmacSeed: 'silly little OpenBazaar seed',
  });
  const db = await connect(dbName, pw);

  return {
    db,
    name: dbName,
    pw,
    peerId,
  };
}

export function login(seed) {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  return async function (dispatch) {
    dispatch({
      type: 'loggingIn',
    });

    let login;
    try {
      login = await _login(dispatch, seed);
      sessionStorage.setItem('login', login.pw);
      dispatch({
        type: 'loggedIn',
        peerId: login.peerId,
      });

      // todo: unsubcribe on logout
      await login.db.profiles
        .findOne(login.peerId)
        .$.subscribe(profile => {
          if (!profile) return;
          dispatch(profileSet(login.peerId, profile.get()));
        });
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'loginError',
        peerId: (login && login.peerId) || undefined,
        error: e,
      });
    }
  }
};

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

export function saveProfile(profile = {}) {
  if (typeof profile.peerID !== 'string' || !profile.peerID) {
    throw new Error('The profile must have a peerID as a string.');
  }

  // TODO: async/await this
  // TODO: put protection on the database that only allows a single profile
  return function (dispatch) {
    return new Promise(
      (resolve, reject) => {
        dispatch({
          type: 'savingProfile',
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
                      type: 'saveProfileSaved',
                      peerId: profile.peerID,
                    });                    
                  },
                  e => {
                    console.error(e);
                    dispatch({
                      type: 'saveProfileError',
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
                type: 'saveProfileError',
                peerId: profile.peerID,
                error: e,
              });
            }
          );
      }
    );
  };
}

export function register(seed) {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  return async function (dispatch) {
    dispatch({
      type: 'registering',
    });

    
    let login;

    try {
      login = await _login(dispatch, seed);
      const firstName = firstNames[Math.floor(Math.random() * (firstNames.length - 1))];
      const lastName = lastNames[Math.floor(Math.random() * (lastNames.length - 1))];      
      const profile = await login.db.profiles.upsert({
        peerID: login.peerId,
        name: `${firstName} ${lastName}`,
        description: 'I like puppy dogs, rainbows and ice cream cones, but not necessarily in that order. 🐾 🌈 🍦',
        avatarUrl: `http://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
      });

      dispatch({
        type: 'registered',
        peerId: login.peerId,
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
        type: 'registerError',
        peerId: (login && login.peerId) || undefined,
        error: e,
      });
    }
  }
};
