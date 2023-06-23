import React, { useCallback, useMemo } from 'react';
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
          label: 'Liked Songs',
          onClick: () => {
            console.log('liked songs');
          },
        },
        {
          label: 'Settiings',
          onClick: () => {
            console.log('settings');
          },
        },
        {
          label: 'Rewind 2023',
          onClick: () => {
            console.log('Rewind 2023');
          },
        },
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
  }, [user, handleLogin, logout]);

  return (
    <LoginWrapper>
      <Menu items={menuItems} />
    </LoginWrapper>
  );
}

export default Login;
