import { move } from 'util/array';

let openModals = [];

const initialState = {
  openModals,
};

const singletonModals = [
  'Login',
];

const openModal = (state={}, action) => {
  let pushNeeded = true;

  if (singletonModals.includes(action.modalType)) {
    const curIndex =
      openModals.find(modal => modal.type === action.type);
    if (typeof curIndex === 'number') {
      move(curIndex, openModals.length);
      pushNeeded = false;
    }
  }

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