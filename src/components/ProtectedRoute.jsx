import { Navigate, useLocation } from 'react-router-dom';
import { sessionManager } from '../utils/session';

export function ProtectedRoute({ children, allowedRole = 'student' }) {
  const location = useLocation();
  const isLoggedIn = sessionManager.isLoggedIn();
  const user = sessionManager.getUser();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (allowedRole) {
    const userRole = (user.role || '').trim().toLowerCase();
    const allowedRoles = Array.isArray(allowedRole) 
      ? allowedRole.map(r => r.trim().toLowerCase()) 
      : [allowedRole.trim().toLowerCase()];

    if (!allowedRoles.includes(userRole)) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Unauthorized</h2>
          <p>You do not have permission to access this page.</p>
          <button onClick={() => window.location.href = '/'}>Go Back</button>
        </div>
      );
    }
  }

  return children;
}
