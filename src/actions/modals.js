import uuidv4 from 'uuid/v4';
import { singletonModals } from 'reducers/modals';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

/*
 * Will open a modal with the given props.
 *
 * @param {object} props - The props the modal will be created with or set with if
 *   it's an already open singleton modal.
 * @param {string} props.modalType - The type of modal. This should correspond with a
 *   constant entry in this file.
 *
 * @returns {string} - The ID of the opened modal. This will be necessary if you want to
 *   close the specific instance of this modal.
 */
export const openModal = (props = {}) => {
  if (typeof props.modalType !== 'string') {
    throw new Error('A modalType must be provided with the props.');
  }

  // todo: check that type matches a declared constant

  return (dispatch, getState) => {
    const curModal = getState().modals.openModals
      .find(modal => singletonModals.includes(props.modalType) &&
        modal.modalType === props.modalType);

    const modalId = curModal ? curModal.modalId : uuidv4();

    dispatch({
      type: OPEN_MODAL,
      ...props,
      modalId,
    });

    return modalId;
  }
};

/*
 * Will close a modal.
 *
 * @param {object} options - You must provide either the modalType or modalId.
 * @param {string} [options.modalType] - The type of modal to close. Any open
 *   instances of this modal type will be closed.
 * @param {string} [options.modalId] - The modal instance with this ID will be
 *   closed.
 */
export const closeModal = (options={}) => {
  if (options.modalType !== undefined &&
    typeof options.modalType !== 'string') {
    throw new Error('If providing the type, it must be provided in the options hash' +
      'as a string.');
  }

  if (options.modalId !== undefined &&
    typeof options.modalId !== 'string') {
    throw new Error('If providing the ID, it must be provided in the options hash' +
      'as a string.');
  }

  if (!options.modalId && !options.modalType) {
    throw new Error('Either a modalId or modalType must be provided in the options hash.');
  }

  return {
    type: CLOSE_MODAL,
    modalType: options.modalType,
    modalId: options.modalId,
  }
};
