const sessionLogin = sessionStorage.getItem('login');

const initialState = {
  loggedIn: false,
  loggingIn: false,
  registering: false,
  peerId: null,
  savingProfile: false,
  sessionLoginSet: sessionLogin && sessionLogin !== 'explicit-logout',
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
    peerId: action.peerId,
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
  return {
    ...state,
    loggedIn: true,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,
    registerError: null,
    loginError: null,
  }  
}

function registering(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: false,
    registering: true,
    peerId: action.peerId,
  }
}

function registered(state={}, action) {
  return {
    ...state,
    loggedIn: true,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,
    registerError: null,
    loginError: null,
  }
}

function registerError(state={}, action) {
  return {
    ...state,
    loggedIn: false,
    loggingIn: false,
    registering: false,
    peerId: action.peerId,
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
    case 'loggedOut':
      return loggedOut(state, action);
    case 'loggingIn':
      return loggingIn(state, action);
    case 'loggedIn':
      return loggedIn(state, action);      
    case 'loginError':
      return loginError(state, action);
    case 'registering':
      return registering(state, action);
    case 'registered':
      return registered(state, action);
    case 'registerError':
      return registerError(state, action);
    case 'profileSet':
      return profileSet(state, action);
    case 'savingProfile':
      return savingProfile(state, action);
    case 'saveProfileSaved':
      return saveProfileSaved(state, action);
    case 'saveProfileError':
      return saveProfileError(state, action);
    case 'sessionLoginSet':
      return sessionLoginSet(state, action);
    default:
      return state;
  }
};
