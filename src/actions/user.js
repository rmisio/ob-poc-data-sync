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
  }
};


function loggingIn(peerId) {
  return {
    type: 'loggingIn',
    peerId,
  }
}

function loginError(peerId, error = {}) {
  return {
    type: 'loginError',
    peerId,
    error,
  }
}

function loggedIn(peerId) {
  return {
    type: 'loggedIn',
    peerId,
  }
}

function profileSet(profile = {}) {
  return {
    type: 'profileSet',
    profile,
  }
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
            const sub = 
              db.profiles
                .findOne(peerId)
                .$.subscribe(profile => {
                  if (!profile) return;
                  dispatch(profileSet(peerId, profile));
                });
          } catch (e) {
            dispatch(loginError(peerId, e));
          }
        },
        error => dispatch(loginError(peerId, error))
      )
  }
};