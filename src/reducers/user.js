import {
  LOGGED_OUT, LOGGED_IN, LOGGING_IN,
  LOGIN_ERROR, PROFILE_SET, SAVING_PROFILE,
  SAVE_PROFILE_SAVED, SAVE_PROFILE_ERROR,
  REGISTERING, REGISTER_ERROR,
  LOGIN_TYPE_SEED, LOGIN_TYPE_PASSWORD,
} from 'actions/user';
import { SESSION_STORAGE_SET } from 'actions/sessionStorage';

const sessionLogin = sessionStorage.getItem('login');

export const initialState = {
  loggedIn: false,
  loggingIn: false,
  registering: false,
  peerId: null,
  savingProfile: false,
  sessionLoginSet: sessionLogin && sessionLogin !== 'explicit-logout',
  profile: undefined,
};

function loggedOut(state={}, action) {
  return {
    ...state,
    ...initialState,
  };
}

function loggingIn(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: true,
    registering: false,
  }
}

function loginError(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,    
    loginError: action.error.message || '', 
  }
}

function loggedIn(state={}, action) {
  let encryptedLogins;

  if (action.encryptedSeed) {
    encryptedLogins = state.encryptedLogins || {};
    encryptedLogins[action.peerId] = {
      name: action.profile.name,
      seed: action.encryptedSeed,
    };
  }

  return {
    ...state,
    loggedIn: true,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,
    registerError: null,
    loginError: null,
    encryptedLogins,
    lastLoginPeerId: action.peerId,
    lastLoginType: action.encryptedSeed === null ?
      LOGIN_TYPE_PASSWORD : LOGIN_TYPE_SEED,
  }  
}

function registering(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: false,
    registering: true,
  }
}

function registerError(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: false,
    registering: false,
    registerError: action.error.message || '',
  }
}

function profileSet(state={}, action) {
  return {
    ...state,
    loggedIn: true,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,
    profile: action.profile,
  }
}

function savingProfile(state={}, action) {
  return {
    ...state,
    savingProfile: true,
    saveProfileError: null,
    savingProfileSaved: false,
  }
}

function saveProfileSaved(state={}, action) {
  return {
    ...state,
    savingProfile: false,
    saveProfileError: null,
    savingProfileSaved: true,
  }
}

function saveProfileError(state={}, action) {
  return {
    ...state,
    savingProfile: false,
    saveProfileError: action.error.message || '',
    savingProfileSaved: false,
  }
}

function sessionLoginSet(state={}, action) {
  return {
    ...state,
    sessionLoginSet: true,
  }
}

export default (state=initialState, action) => {
  switch(action.type) {
    case LOGGED_OUT:
      return loggedOut(state, action);
    case LOGGING_IN:
      return loggingIn(state, action);
    case LOGGED_IN:
      return loggedIn(state, action);      
    case LOGIN_ERROR:
      return loginError(state, action);
    case REGISTERING:
      return registering(state, action);
    case REGISTER_ERROR:
      return registerError(state, action);
    case PROFILE_SET:
      return profileSet(state, action);
    case SAVING_PROFILE:
      return savingProfile(state, action);
    case SAVE_PROFILE_SAVED:
      return saveProfileSaved(state, action);
    case SAVE_PROFILE_ERROR:
      return saveProfileError(state, action);
    case SESSION_STORAGE_SET:
      return sessionLoginSet(state, action);
    default:
      return state;
  }
};
