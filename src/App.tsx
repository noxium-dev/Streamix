import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopNavbar from './components/ui/layout/TopNavbar';
import BottomNavbar from './components/ui/layout/BottomNavbar';
import Footer from './components/ui/layout/Footer';
import HomePage from './app/page';
import WatchPage from './app/watch/[id]/page';
import AdminPage from './app/admin/page';
import FaqPage from './app/faq/page';
import FavoritesPage from './app/favorites/page';
import DiscoverPage from './app/discover/page';
import GenresPage from './app/genres/page';
import DmcaPage from './app/dmca/page';
import PrivacyPage from './app/privacy/page';
import TosPage from './app/tos/page';
import SearchPage from './app/search/page';
import NotFound from './app/not-found';
import SettingsPage from './app/settings/page';
import AccountPage from './app/account/page';
import AuthPage from './app/auth/page';

import LoadingSpinner from "./components/ui/LoadingSpinner";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <TopNavbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 md:px-6 py-6 flex-grow">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/videos" element={<DiscoverPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/dmca" element={<DmcaPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/tos" element={<TosPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNavbar />
      <Footer />
    </div>
  );
};

export default App;
