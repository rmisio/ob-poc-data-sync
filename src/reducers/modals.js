import { move } from 'util/array';
import {
  OPEN_MODAL,
  CLOSE_MODAL,
} from 'actions/modals';

let openModals = [];

const initialState = {
  openModals,
};

/*
 * Singleton modals will only allow one model per type to be opened. If you
 * attempt to open a singleton modal when one is already open, the existing one
 * will be brought to the top.
 *
 */
export const singletonModals = [
  'Login',
];

const openModal = (state={}, action) => {
  if (singletonModals.includes(action.modalType)) {
    const curIndex =
      openModals.find(modal => modal.type === action.type);
    if (typeof curIndex === 'number') {
      move(curIndex, openModals.length);
    }
  }

  const modalState = { ...action };
  delete modalState.type;
  openModals.push(modalState);

  return {
    ...state,
    openModals,
  }
}

// todo: test closing via different scenarios
const closeModal = (state={}, action) => {
  openModals = openModals.filter(modal => {
    return action.id ?
      modal.modalId !== action.modalId :
      modal.modalType !== action.modalType;
  });

  return {
    ...state,
    openModals,
  }
}

export default (state=initialState, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return openModal(state, action);
    case CLOSE_MODAL:
      return closeModal(state, action);      
    default:
      return state;
  }
};