'use client';

import { store } from './index';
import { Provider } from 'react-redux';
import { FormProvider } from './FormProvider';
import { ChildrenProps } from './slices/interface';
import Modal from '@/components/primitive/modal/Modal';
import { ViewportWatcher } from './slices/ViewportWatcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5
    }
  }
});

export default function StoreProvider({ children }: ChildrenProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <FormProvider>
          <ViewportWatcher />
          {children}
          <Modal />
        </FormProvider>
      </QueryClientProvider>
    </Provider>
  );
};