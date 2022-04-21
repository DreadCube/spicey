import React, { useCallback } from 'react';

import styled from 'styled-components';

import {
  useNavigate, useLocation,
} from 'react-router-dom';

import { LogoAlt } from './components/Logo';
import AudioCard from './components/AudioCard';
import SearchInput from './components/SearchInput';
import Player from './components/Player';

import useTracks from './hooks/useTracks';

import { BASE_URL } from './config';
import { Track } from './types';

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
  z-index: 1;

  @media only screen and (max-width: 600px) {
    flex-wrap: wrap;

    justify-content: center;

    padding-bottom: 10px;
    
    input {
      width: 100%;
      margin-bottom: 10px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
`;

const LogoWrapper = styled.div`
  margin: 10px;
`;

const TracksWrapper = styled.div`
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

const getTrackUrl = (location) => {
  const searchParams = new URLSearchParams(location.search);

  if (searchParams.has('search')) {
    return `${BASE_URL}/v1/tracks/search?query=${searchParams.get('search')}&app_name=SPICEY`;
  }
  if (location.pathname.includes('artist')) {
    const [, artistId] = location.pathname.split('artist/');
    return `${BASE_URL}/v1/users/${artistId}/tracks?app_name=SPICEY`;
  }
  return `${BASE_URL}/v1/tracks/trending?app_name=SPICEY`;
};

function App() {
  const location = useLocation();

  const { tracks } = useTracks(getTrackUrl(location));
  const [playingTrackId, setPlayingTrackId] = React.useState<string>(null);
  const [playlist, setPlaylist] = React.useState<Track[]>([]);

  const navigate = useNavigate();

  const onSearch = useCallback(async (s: string) => {
    navigate({
      pathname: '/',
      search: `?search=${s}`,
    });
  }, [navigate]);

  const handlePlayTrack = React.useCallback((trackId) => {
    const index = tracks.findIndex((e) => e.id === trackId);

    const prevTracks = tracks.slice(0, index);
    const nextTracks = tracks.slice(index);

    const newPlaylist = [
      ...nextTracks,
      ...prevTracks,
    ];

    setPlaylist(newPlaylist);
  }, [tracks]);

  const onPlaybackTrack = React.useCallback((trackId) => {
    setPlayingTrackId(trackId);
  }, []);

  return (
    <Wrapper>
      <Header>
        <LogoWrapper>
          <LogoAlt />
        </LogoWrapper>
        <SearchInput onSearch={onSearch} />
      </Header>
      <Content>
        <TracksWrapper>
          {tracks.map((track) => (
            <AudioCard
              onClick={handlePlayTrack}
              key={track.id}
              id={track.id}
              artworkSrc={track.artworkSrc}
              trackName={track.trackName}
              artist={track.artist}
              isActive={playingTrackId === track.id}
            />
          ))}
        </TracksWrapper>
      </Content>
      <Player playlist={playlist} onPlaybackTrack={onPlaybackTrack} />
    </Wrapper>
  );
}

export default App;
