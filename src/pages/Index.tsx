import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard (which will handle auth)
  return <Navigate to="/" replace />;
};

export default Index;
