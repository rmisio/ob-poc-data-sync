import { singletonModals } from 'reducers/modals';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const openModal = (props = {}) => {
  if (typeof props.modalType !== 'string') {
    throw new Error('A modalType must be provided with the props.');
  }

  // if (!singletonModals.includes(props.modalType) &&
  //   typeof props.modalId !== 'string') {
  //   throw new Error('For non-singleton modals, a modalId must be provided as a string.');
  // }

  return {
    type: OPEN_MODAL,
    ...props,
  }
};

/*
 * For singleton modals, you should provide the modalType and any open single instance
 * of that type will be closed. If you provide the type for a non-singleton modal, all
 * open instances of that modal will be closed. To close a specific non-singleton
 * instance, be sure to pass in the modal id.
 */
export const closeModal = (type, id) => {
  if (typeof type !== 'string') {
    throw new Error('Please provide the type as a string.');
  }

  if (id !== undefined && id !== null && typeof id !== 'string') {
    throw new Error('If providing an id, it must be provided as a string.');
  }  

  return {
    type: CLOSE_MODAL,
    modalType: type,
    modalId: id,
  }
};