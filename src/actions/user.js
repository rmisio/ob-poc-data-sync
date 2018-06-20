export const logout = () => {
  return {
    type: 'logout',
  }
};

export const login = peerId => {
  return {
    type: 'login',
    peerId,
  }
};