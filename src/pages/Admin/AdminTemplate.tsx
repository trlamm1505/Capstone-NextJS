import React from 'react';
import { NavLink, Outlet} from 'react-router-dom';
import Topbar from './_components/Topbar';
import Sidebar from './_components/Sidebar';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const AdminTemplate: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.login);

  // Optional auto-redirect:
  // useEffect(() => {
  //   navigate('movies/list');
  // }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NavLink
          key="/login-admin"
          to="/login-admin"
          className="text-blue-500 hover:text-blue-700 cursor-pointer underline"
        >
          Please login and try again...
        </NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="min-h-screen flex flex-col flex-1">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminTemplate;