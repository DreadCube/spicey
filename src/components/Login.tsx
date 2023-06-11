import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import styled from 'styled-components';

import audius from '../helpers/audius/index';
import { UserProfile } from '../helpers/audius/types';
import { useAuth } from '../providers/AuthProvider';
import Tooltip from './Tooltip';

const LoginWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    margin: 10px;
    margin-right: 20px;
    justify-content: flex-end;
    align-self: flex-end;
`;

function Login() {
  const { user, setUser } = useAuth();

  React.useEffect(() => {
    audius.loginInit(
      (res) => {
        setUser(res.userId);
      },
      () => {},
    );
  }, [setUser]);

  const handleClick = () => {
    audius.login();
  };

  return (
    <LoginWrapper>
      {
            user
              ? (

                <Tooltip title={`Logged in as: ${user.handle}`}>
                  <Icon icon="mdi:user-outline" fontSize="30px" color="rgb(255,0,169)" />
                </Tooltip>
              )
              : (
                <Tooltip title="Login with Audius">
                  <Icon icon="material-symbols:login" color="white" onClick={handleClick} fontSize="30px" />
                </Tooltip>
              )
        }
    </LoginWrapper>
  );
}
export default Login;
