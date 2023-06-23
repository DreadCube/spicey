import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import audius from '../helpers/audius/index';
import { useAuth } from '../providers/AuthProvider';
import Menu from './Menu';

const LoginWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    margin: 10px;
    margin-right: 20px;
    justify-content: flex-end;
    align-self: flex-end;
`;

function Login() {
  const { user, setUser, logout } = useAuth();

  const navigate = useNavigate();

  React.useEffect(() => {
    audius.loginInit(
      (res) => {
        setUser(res.userId);
      },
      () => {},
    );
  }, [setUser]);

  const handleLogin = useCallback(() => {
    audius.login();
  }, []);

  const menuItems = useMemo(() => {
    if (user) {
      return [
        {
          label: 'Your liked Songs',
          onClick: () => {
            navigate('/favorites');
          },
        },
        {
          label: 'Your artist page',
          onClick: () => {
            navigate(`/artist/${user.id}`);
          },
        },
        /* {
          label: 'Rewind 2023',
          onClick: () => {
            console.log('Rewind 2023');
          },
        }, */
        {
          label: 'Logout',
          onClick: logout,
        },
      ];
    }

    return [
      {
        label: 'Login with Audius',
        onClick: handleLogin,
      },
    ];
  }, [user, handleLogin, logout, navigate]);

  return (
    <LoginWrapper>
      <Menu items={menuItems} />
    </LoginWrapper>
  );
}

export default Login;
