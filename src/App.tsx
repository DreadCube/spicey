import React, { useState, useCallback, useEffect } from 'react';

import styled from 'styled-components';

import {
  useNavigate, useLocation,
} from 'react-router-dom';

import { LogoAlt } from './components/Logo';
import AudioCard, { Artist } from './components/AudioCard';
import SearchInput from './components/SearchInput';
import Player from './components/Player';

import useTracks from './hooks/useTracks';

import { BASE_URL } from './config';
import { Track } from './types';

import followersSvg from './svgs/followers.svg';
import trackCountSvg from './svgs/songCount.svg';
import locationSvg from './svgs/location.svg';

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

const ArtistHeaderSection = styled.div`
  height: 300px;
  background-color: black;
  border-radius: 0px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  background-image: url('${({ coverSrc }) => coverSrc}');
  position: relative;
`;

const ArtistHeaderProfilePicture = styled.img`
  height: 250px;
  box-shadow: 0 0 10px 0px white;
  z-index: 2;

  @media only screen and (max-width: 750px) {
    position: absolute;
    height: 150px;
    bottom: 0;
    right: 0;
    z-index: 0;
    box-shadow: none;
  }
`;

const ArtistHeaderDescription = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #131313ab;
  padding: 20px;
  height: 160px;
  z-index: 1;
`;

const ArtistHeaderName = styled(Artist)`
  font-size: 50px;

  @media only screen and (max-width: 750px) {
    font-size: 25px;
    font-weight: bold;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { tracks } = useTracks(getTrackUrl(location));
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
        <ArtistHeaderSection coverSrc={artist.coverSrc}>

          <ArtistHeaderProfilePicture src={artist.profilePictureSrc} />
          <ArtistHeaderDescription>
            <ArtistHeaderName>{artist.name}</ArtistHeaderName>

            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <img src={followersSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
                <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.followers}</Artist>
              </div>
              <div style={{ marginLeft: 10, display: 'flex', alignItems: 'end' }}>
                <img src={trackCountSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
                <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.trackCount}</Artist>
              </div>
              {artist.location
                && (
                <div style={{ marginLeft: 10, display: 'flex', alignItems: 'end' }}>
                  <img src={locationSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
                  <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.location}</Artist>
                </div>
                )}
            </div>
          </ArtistHeaderDescription>
        </ArtistHeaderSection>
        )}
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
