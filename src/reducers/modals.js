import { OPEN_MODAL, CLOSE_MODAL } from 'actions/modals';

let openModals = [];

const initialState = {
  openModals
};

/*
 * Singleton modals will only allow one model per type to be opened. If you
 * attempt to open a singleton modal when one is already open, the existing one
 * will be brought to the top.
 *
 */
export const singletonModals = ['Login'];

const openModal = (state = {}, action) => {
  let openModals = state.openModals;

  // todo - abstract out bringToTop function

  const curModal = openModals.find(
    modal =>
      singletonModals.includes(action.modalType) &&
      modal.modalType === action.modalType
  );

  if (curModal) {
    openModals = openModals.filter(modal => modal !== curModal);
  }

  const modalState = { ...action };
  delete modalState.type;
  openModals = state.openModals.concat({
    ...curModal,
    ...modalState
  });

  return {
    ...state,
    openModals
  };
};

// todo: test closing via different scenarios
const closeModal = (state = {}, action) => {
  openModals = openModals.filter(modal => {
    return action.id
      ? modal.modalId !== action.modalId
      : modal.modalType !== action.modalType;
  });

  return {
    ...state,
    openModals
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return openModal(state, action);
    case CLOSE_MODAL:
      return closeModal(state, action);
    default:
      return state;
  }
};
