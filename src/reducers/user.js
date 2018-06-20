let initialState = {};

const dummyUser = {
  peerId: 12345,
  avatar: 'http://i.pravatar.cc/150?img=69',
}

initialState = {
  ...dummyUser,
};

const logout = (state={}, action) => {
  return {};
}

const login = (state={}, action) => {
  return {
    ...dummyUser,
  };
}

const reduceState = (state={}, action) => {
  switch(action.type) {
    case 'logout':
      return logout(state, action);
    case 'login':
      return login(state, action);      
    default:
      return state;
  }
};

export default (state=initialState, action) => {
  let reduced = reduceState(state, action);

  const foo = {
    ...reduced,
    loggedIn: !!reduced.peerId,
  }

  return foo;
}