import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PublicProviders } from './providers/PublicProviders';
import { PublicRoutes } from './routes/PublicRoutes';

export const App: FC = () => {
  return (
    <PublicProviders>
      <BrowserRouter>
        <PublicRoutes />
      </BrowserRouter>
    </PublicProviders>
  );
};

export default App;
