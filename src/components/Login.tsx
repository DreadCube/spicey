import React, { useState } from 'react';
import styled from 'styled-components';

import audius from '../helpers/audius/index';
import { UserProfile } from '../helpers/audius/types';
import { useAuth } from '../providers/AuthProvider';

const LoginWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    margin-right: 20px;
    align-self: center;
    align-items: baseline;


    font-family: miles;
    font-size: 12px;
    text-transform: uppercase;
    color: rgb(255, 0, 169);
`;

const Button = styled.button`
    background-color: transparent;
    border: none;
    
    
    font-family: inherit;
    font-size: inherit;
    text-transform: inherit;
    color: inherit;
    

    border: 1px solid rgb(255, 0, 169);
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
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
                <>
                  <span style={{ marginRight: 10 }}>{user.handle}</span>
                  <img
                    style={{ width: 60, height: 60, borderRadius: 10 }}
                    src={user.profilePicture._150x150}
                    alt="todo"
                  />
                </>
              )
              : (
                <Button onClick={handleClick}>
                  <img
                    style={{
                      width: 20, height: 20, filter: 'invert(1)', marginRight: 10,
                    }}
                    src="https://dl.dropboxusercontent.com/s/73hxxq38cvnf7cg/Glyph_Black%402x.png?dl=1"
                    alt="todo"
                  />
                  <span>Login</span>
                </Button>
              )
        }
    </LoginWrapper>
  );
}
export default Login;
