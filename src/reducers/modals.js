let openModals = [];

const initialState = {
  openModals,
};

const openModal = (state={}, action) => {
  const modalState = {
    ...action,
    type: action.modalType,
  };
  delete modalState.modalType;
  openModals.push(modalState);

  return {
    ...state,
    openModals,
  }
}

const closeModal = (state={}, action) => {
  console.dir(action);
  openModals = openModals.filter(modal => modal.id !== action.id);

  return {
    ...state,
    openModals,
  }
}

export default (state=initialState, action) => {
  switch(action.type) {
    case 'openModal':
      return openModal(state, action);
    case 'closeModal':
      return closeModal(state, action);      
    default:
      return state;
  }
};