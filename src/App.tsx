import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLayout from './components/Layout/AppLayout';
import BrokersPage from './pages/BrokersPage';
import DiamondsPage from './pages/DiamondsPage';
import TransactionsPage from './pages/TransactionsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/brokers" replace />} />
          <Route path="brokers" element={<BrokersPage />} />
          <Route path="diamonds" element={<DiamondsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="*" element={<Navigate to="/brokers" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
