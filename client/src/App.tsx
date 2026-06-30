import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HomeScreen } from './screens/HomeScreen';
import { RandomListScreen } from './screens/RandomListScreen';
import { SavedProfilesScreen } from './screens/SavedProfilesScreen';
import { ProfileDetailScreen } from './screens/ProfileDetailScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/list" element={<RandomListScreen />} />
          <Route path="/history" element={<SavedProfilesScreen />} />
          <Route path="/profile/:id" element={<ProfileDetailScreen />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#1f2937',
            color: '#f9fafb',
            fontSize: '13px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
