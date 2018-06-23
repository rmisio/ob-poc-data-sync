const initialState = {
  loggedIn: false,
  loggingIn: false,
  peerId: null,
};

const dummyUser = {
  peerId: 12345,
  avatar: 'http://i.pravatar.cc/150?img=69',
}

function loggedOut(state={}, action) {
  return initialState;
}

function loggingIn(state={}, action) {
  return {
    loggedIn: false,
    loggingIn: true,
    peerId: action.peerId,
  }
}

function loginError(state={}, action) {
  return {
    loggedIn: false,
    loggingIn: false,
    loginErrorPeerId: action.peerId,    
    loginError: action.error, 
  }
}

function loggedIn(state={}, action) {
  return {
    loggedIn: true,
    loggingIn: false,
    peerId: action.peerId,    
  }  
}

function profileSet(state={}, action) {
  return {
    loggedIn: true,
    loggingIn: false,
    peerId: action.peerId,
    profile: action.profile,
  }
}

export default (state={}, action) => {
  switch(action.type) {
    case 'loggedOut':
      return loggedOut(state, action);
    case 'loggingIn':
      return loggingIn(state, action);
    case 'loggedIn':
      return loggedIn(state, action);      
    case 'loginError':
      return loginError(state, action);
    case 'profileSet':
      return profileSet(state, action);
    default:
      return state;
  }
};
