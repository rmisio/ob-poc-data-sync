export const logout = () => {
  return {
    type: 'logout',
  }
};

export const login = seed => {
  if (typeof seed !== 'string') {
    throw new Error('A seed must be provided as a string.');
  }

  return {
    type: 'login',
    peerId,
  }
};