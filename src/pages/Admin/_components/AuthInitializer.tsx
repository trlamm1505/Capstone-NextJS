import { useEffect} from 'react';
import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../LoginPage/slice';
import sessionManager from '../../../utils/session';
import { store } from '../../store';
import type { AppDispatch, RootState } from '../../store';

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    console.log('AuthInitializer: Checking authentication status on app load');

    // Set Redux store for sessionManager
    sessionManager.setStore(store);

    // Dispatch auth status check
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('AuthInitializer: User is authenticated, starting session management');

      if (sessionManager.isSessionValid()) {
        console.log('AuthInitializer: Session is valid, initializing session management');
        sessionManager.initSession();
      } else {
        console.log('AuthInitializer: Session has expired, clearing data');
        sessionManager.stopSession();
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_isAuthenticated');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('lastActivity');
      }
    } else {
      console.log('AuthInitializer: User is not authenticated, stopping session management');
      sessionManager.stopSession();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthInitializer;
