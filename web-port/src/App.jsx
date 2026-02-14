import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';

import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import UsersView from './components/UsersView';
import HistoryView from './components/HistoryView';

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryView />} />
              <Route path="/sales" element={<SalesView />} />
              <Route path="/users" element={<UsersView />} />
              <Route path="/history" element={<HistoryView />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
