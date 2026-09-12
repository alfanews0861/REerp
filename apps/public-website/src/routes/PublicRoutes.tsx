import { FC, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { PublicLayout } from '../layouts/PublicLayout';

const HomePage = lazy(() => import('../pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const VenturesPage = lazy(() => import('../pages/Ventures/VenturesPage').then((m) => ({ default: m.VenturesPage })));
const VentureDetailPage = lazy(() => import('../pages/Ventures/VentureDetailPage').then((m) => ({ default: m.VentureDetailPage })));
const PlotExplorerPage = lazy(() => import('../pages/Plots/PlotExplorerPage').then((m) => ({ default: m.PlotExplorerPage })));
const AboutPage = lazy(() => import('../pages/About/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage').then((m) => ({ default: m.ContactPage })));

const LoadingFallback: FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

export const PublicRoutes: FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ventures" element={<VenturesPage />} />
          <Route path="/ventures/:id" element={<VentureDetailPage />} />
          <Route path="/plots" element={<PlotExplorerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
