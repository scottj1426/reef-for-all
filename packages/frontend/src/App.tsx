import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Check if Auth0 is configured
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const isConfigured =
    domain &&
    clientId &&
    domain !== "placeholder.auth0.com" &&
    domain !== "your-auth0-domain.auth0.com" &&
    clientId !== "placeholder-client-id" &&
    clientId !== "your-auth0-client-id";

  if (!isConfigured) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <img
            src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
            alt="Auth0 Logo"
            className="auth0-logo"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="main-title">Auth0 Setup Required</h1>
          <div className="action-card">
            <div style={{ color: '#fbd38d', marginBottom: '1rem', fontSize: '1.1rem' }}>
              ⚠️ Auth0 credentials not configured
            </div>
            <p className="action-text" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
              To get started, you need to set up your Auth0 application:
            </p>
            <ol style={{ textAlign: 'left', color: '#cbd5e0', lineHeight: '1.8', fontSize: '0.95rem' }}>
              <li>Go to <a href="https://manage.auth0.com/dashboard/" target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ed' }}>Auth0 Dashboard</a></li>
              <li>Create a new Single Page Application</li>
              <li>Set Allowed Callback/Logout URLs to: <code style={{ background: '#1a1e27', padding: '2px 6px', borderRadius: '3px' }}>http://localhost:5173</code></li>
              <li>Copy your Domain and Client ID</li>
              <li>Update the <code style={{ background: '#1a1e27', padding: '2px 6px', borderRadius: '3px' }}>.env</code> file in your project root</li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
