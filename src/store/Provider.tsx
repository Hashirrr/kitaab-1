'use client';

import { store } from './index';
import { Provider } from 'react-redux';
import { ChildrenProps } from './slices/interface';
import Modal from '@/components/primitive/modal/Modal';
import { ViewportWatcher } from './slices/ViewportWatcher';

export default function StoreProvider({ children }: ChildrenProps) {
  return (
    <Provider store={store}>
      <ViewportWatcher />
      {children}
      <Modal />
    </Provider>
  );
};