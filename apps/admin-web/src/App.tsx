import { FC, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthListener } from '@real-estate-erp/hooks';
import { setUser } from './store/slices/authSlice';

const AppContent: FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuthListener();

  useEffect(() => {
    dispatch(setUser(user));
  }, [user, dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export const App: FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
