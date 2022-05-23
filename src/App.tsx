import React, {
  useState, useCallback, useEffect,
} from 'react';

import styled from 'styled-components';

import {
  useNavigate, useLocation,
} from 'react-router-dom';

import axios from 'axios';
import { LogoAlt } from './components/Logo';
import AudioCard from './components/AudioCard';
import SearchInput from './components/SearchInput';
import Player from './components/Player';

import useTracks from './hooks/useTracks';

import { Track } from './types';

import ArtistHeader from './components/ArtistHeader';
import Loader from './components/Loader';
import CardSkeleton from './components/CardSkeleton';

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
    return `tracks/search?query=${searchParams.get('search')}`;
  }
  if (location.pathname.includes('artist')) {
    const [, artistId] = location.pathname.split('artist/');
    return `/users/${artistId}/tracks`;
  }
  return '/tracks/trending';
};

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [preloaded, setPreloaded] = useState(false);

  const { tracks, isLoading } = useTracks(getTrackUrl(location));
  const [playingTrackId, setPlayingTrackId] = useState<string>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const navigate = useNavigate();

  const onSearch = useCallback(async (search: string) => {
    navigate({
      pathname: '/',
      search: `?search=${search}`,
    });
  }, [navigate]);

  const handlePlayTrack = useCallback((trackId) => {
    const index = tracks.findIndex((e) => e.id === trackId);

    const prevTracks = tracks.slice(0, index);
    const nextTracks = tracks.slice(index);

    const newPlaylist = [
      ...nextTracks,
      ...prevTracks,
    ];

    setPlaylist(newPlaylist);
  }, [tracks]);

  const onPlaybackTrack = useCallback((trackId) => {
    setPlayingTrackId(trackId);
  }, []);

  const artist = location.pathname.includes('artist') && tracks[0]?.artist;

  return (
    <Wrapper>
      <Header>
        <LogoWrapper>
          <LogoAlt />
        </LogoWrapper>
        <SearchInput onSearch={onSearch} />
      </Header>
      <Content>
        {artist
        && (
          <ArtistHeader artist={artist} isLoading={isLoading} />
        )}
        <TracksWrapper>

          {isLoading && Array(50).fill('').map((_, key) => (
            <CardSkeleton key={`cardSkeleton-${key}`} />
          ))}

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
