'use client';

import { store } from './index';
import { useAppDispatch } from './hooks';
import { useOnConfirm } from './slices/utils';
import { closeModal } from './slices/uiSlice';
import { selectModal } from './slices/selectors';
import { ChildrenProps } from './slices/interface';
import { Provider, useSelector } from 'react-redux';
import Modal from '@/components/primitive/modal/Modal';
import { ViewportWatcher } from './slices/ViewportWatcher';

function ModalContainer() {
  const dispatch = useAppDispatch();
  const modal = useSelector(selectModal);
  const onConfirm = useOnConfirm();

  return (
    <Modal
      type={modal.type}
      title={modal.title}
      onConfirm={onConfirm}
      isOpen={modal.isOpen}
      primaryBtn={modal.confirmText}
      secondaryBtn={modal.cancelText}
      onClose={() => dispatch(closeModal())}
    />
  );
}

export default function StoreProvider({ children }: ChildrenProps) {
  return (
    <Provider store={store}>
      <ViewportWatcher />
      {children}
      <ModalContainer />
    </Provider>
  );
}