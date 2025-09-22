import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react'
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import './app.css';

function PrivateRoute({ children }) {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
