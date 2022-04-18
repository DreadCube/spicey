import React from 'react';

import styled from 'styled-components';

import {
  Routes, Route, useParams, useNavigate,
} from 'react-router-dom';

import axios from 'axios';
import { LogoAlt } from './components/Logo';
import AudioCard from './components/AudioCard';
import SearchInput from './components/SearchInput';

import { BASE_URL } from './config';
import Player from './components/Player';

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

interface TrackInterface {
  id: string
  src: string
  track: string
  artist: string
  artistId: string
}
const useTracks = (url: string) => {
  const [tracks, setTracks] = React.useState<TrackInterface[]>([]);

  const loadTracks = async (tracksUrl: string) => {
    const res = await axios.get(tracksUrl);

    const foundedTracks = res.data.data.map((track) => ({
      id: track.id,
      src: track.artwork['150x150'],
      track: track.title,
      artist: track.user.name,
      artistId: track.user.id,
    }));

    setTracks(foundedTracks);
  };

  React.useEffect(() => {
    loadTracks(url);
  }, [url]);

  return {
    tracks,
  };
};

const getTrackUrl = (search) => {
  if (search.length) {
    return `${BASE_URL}/v1/tracks/search?query=${search}&app_name=SPICEY`;
  }
  return `${BASE_URL}/v1/tracks/trending?app_name=SPICEY`;
};

interface DashboardProps {
  tracks: TrackInterface[]
  handlePlayTrack: (id: string) => void
  playingTrackId: string
}
function Dashboard({ tracks, handlePlayTrack, playingTrackId }: DashboardProps) {
  return (
    <TracksWrapper>
      {tracks.map((track) => (
        <AudioCard
          onClick={handlePlayTrack}
          key={track.id}
          id={track.id}
          src={track.src}
          track={track.track}
          artist={track.artist}
          artistId={track.artistId}
          isActive={playingTrackId === track.id}
        />
      ))}
    </TracksWrapper>
  );
}

interface CoverProps {
  src: string
}
const Cover = styled.div<CoverProps>`
  background-image: url("${({ src }) => src}");

  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  width: 100%;
  height: 100%;

  min-height: calc(100vh - 150px);
`;

interface UserPageProps {
  handlePlayTrack: (id: string) => void
  playingTrackId: string
}
function UserPage({ handlePlayTrack, playingTrackId }: UserPageProps) {
  const { artistId } = useParams();

  const [cover, setCover] = React.useState('');

  const { tracks } = useTracks(`${BASE_URL}/v1/users/${artistId}/tracks?app_name=SPICEY`);

  const loadArtist = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/v1/users/${id}?app_name=SPICEY`);
    setCover(res.data.data.cover_photo['2000x']);
  };

  React.useEffect(() => {
    loadArtist(artistId);
  }, [artistId]);

  return (
    <Cover src={cover}>
      <TracksWrapper>
        {tracks.map((track) => (
          <AudioCard
            onClick={handlePlayTrack}
            key={track.id}
            id={track.id}
            src={track.src}
            track={track.track}
            artist={track.artist}
            artistId={track.artistId}
            isActive={playingTrackId === track.id}
          />
        ))}
      </TracksWrapper>
    </Cover>
  );
}

function App() {
  const [search, setSearch] = React.useState('');
  const { tracks } = useTracks(getTrackUrl(search));
  const [playingTrackId, setPlayingTrackId] = React.useState(null);
  const [playlist, setPlaylist] = React.useState([]);

  const navigate = useNavigate();

  const onSearch = async (s: string) => {
    setSearch(s);
    navigate('/');
  };

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
        <Routes>
          <Route path="/" element={<Dashboard playingTrackId={playingTrackId} tracks={tracks} handlePlayTrack={handlePlayTrack} />} />
          <Route path="/artist/:artistId" element={<UserPage playingTrackId={playingTrackId} handlePlayTrack={handlePlayTrack} />} />
        </Routes>
      </Content>
      <Player playlist={playlist} onPlaybackTrack={onPlaybackTrack} />
    </Wrapper>
  );
}

export default App;
