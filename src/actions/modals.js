export const openModal = (modalType, props = {}) => {
  return {
    type: 'openModal',
    id: Date.now(),
    modalType,
    props,
  }
};

export const closeModal = id => {
  return {
    type: 'closeModal',
    id,
  }
};