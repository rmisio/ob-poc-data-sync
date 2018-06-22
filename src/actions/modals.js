export const openModal = (modalType, props = {}) => {
  if (typeof modalType !== 'string') {
    throw new Error('Please provide a modalType as a string.');
  }

  return {
    type: 'openModal',
    id: Date.now().toString(), // todo: use GUID function of some sort
    modalType,
    props,
  }
};

export const closeModal = id => {
  if (typeof id !== 'string') {
    throw new Error('Please provide an id as a string.');
  }

  return {
    type: 'closeModal',
    id,
  }
};