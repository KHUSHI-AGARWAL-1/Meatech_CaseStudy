import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAppSelector } from './app/hooks';
import { LoginPage } from './features/auth/LoginPage';
import { TasksPage } from './features/tasks/TasksPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export function App() {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
