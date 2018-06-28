import { connect, destroy } from 'util/database';
import { seedToPeerId } from 'util/crypto';

function loggedOut() {
  return {
    type: 'loggedOut',
  }
};

export function logout() {
  return function (dispatch) {
    destroy();
    dispatch(loggedOut());
  };
};


function loggingIn(peerId) {
  return {
    type: 'loggingIn',
    peerId,
  };
}

function loginError(peerId, error = {}) {
  return {
    type: 'loginError',
    peerId,
    error,
  };
}

function loggedIn(peerId) {
  return {
    type: 'loggedIn',
    peerId,
  };
}

function profileSet(peerId, profile = {}) {
  return {
    type: 'profileSet',
    peerId,
    profile,
  };
}

function registerError(peerId, error = {}) {
  return {
    type: 'registerError',
    peerId,
    error,
  };
}

export function login(seed) {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  const peerId = seedToPeerId(seed);

  return function (dispatch) {
    dispatch(loggingIn(peerId));

    return connect(peerId, seed)
      .then(
        db => {
          dispatch(loggedIn(peerId));
          try {
            db.profiles
              .findOne(peerId)
              .$.subscribe(profile => {
                if (!profile) return;
                dispatch(profileSet(peerId, profile.get()));
              });
          } catch (e) {
            dispatch(loginError(peerId, e));
          }
        },
        error => dispatch(loginError(peerId, error))
      );
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
                    dispatch({
                      type: 'saveProfileError',
                      peerId: profile.peerID,
                      error: e,
                    });
                    reject(e);
                    console.log('no soup');
                    window.soup = e;
                  },
                );
            },
            e => {
              dispatch({
                type: 'saveProfileError',
                peerId: profile.peerID,
                error: e,
              });
              console.log('poop');
              window.poop = e;
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

  const peerId = seedToPeerId(seed);

  return function (dispatch) {
    dispatch({
      type: 'registering',
      peerId,
    });

    return connect(peerId, seed)
      .then(
        db => {
          const firstName = firstNames[Math.floor(Math.random() * (firstNames.length - 1))];
          const lastName = lastNames[Math.floor(Math.random() * (lastNames.length - 1))];

          db.profiles.upsert({
            peerID: peerId,
            name: `${firstName} ${lastName}`,
            description: 'I like puppy dogs, rainbows and ice cream cones, but not necessarily in that order. 🐾 🌈 🍦',
            avatarUrl: `http://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
          }).then(
            profile => {
              console.log('boom bam bizzle');
              dispatch({
                type: 'registered',
                peerId,
              });

              profile.$.subscribe(profile => {
                if (!profile) return;
                // todo: move this get() call into profileSet.
                dispatch(profileSet(peerId, profile.get()));
              });
            },
            e => dispatch(registerError(peerId, e))
          )
        },
        error => dispatch(registerError(peerId, error))
      );
  }
}