import React, {
  useCallback, useEffect,
} from 'react';

import styled from 'styled-components';

import {
  useNavigate, useLocation,
  Outlet,
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogoAlt } from './components/Logo';
import SearchInput from './components/SearchInput';
import Player from './components/Player';

import Login from './components/Login';
import PlaylistProvider from './providers/PlaylistProvider';
import AuthProvider from './providers/AuthProvider';

const Wrapper: React.FC = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: black;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  width: 100%;
  position: fixed;
  background-color: black;
  z-index: 99;

  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;

    justify-content: center;

    padding-bottom: 10px;
    
    div:has(input) {
      width: 100%;
      
      > input {
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
      }
    }

    > div:first-child > div > span:first-child {
      font-size: 40px;
    }

    > div:first-child > div > span:nth-child(2) {
      display: none;
    }

    > div:nth-child(3)  {
      position: absolute;
      top: 0;
      right: 0;
      margin: 20px;
    }
  }
`;

const LogoWrapper = styled.div`
  margin: 10px;
`;

export const TracksWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  justify-content: center;
  grid-gap: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

  @media only screen and (max-width: 600px) {
    grid-template-columns: 160px 160px;
  }
`;

const Content = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;

  @media only screen and (max-width: 600px) {
    margin-top: 150px;
  }
`;

const queryClient = new QueryClient();

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigate = useNavigate();

  const onSearch = useCallback(async (search: string) => {
    navigate({
      pathname: `/search/${search}`,
    });
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlaylistProvider>
          <Wrapper>
            <Header>
              <LogoWrapper>
                <LogoAlt />
              </LogoWrapper>
              <SearchInput onSearch={onSearch} />
              <Login />
            </Header>
            <Content>
              <Outlet />
            </Content>
            <Player />
          </Wrapper>
        </PlaylistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
