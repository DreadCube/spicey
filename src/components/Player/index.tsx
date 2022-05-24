import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Artist, TrackName } from '../AudioCard';

import playSvg from '../../svgs/play.svg';
import pauseSvg from '../../svgs/pause.svg';

import { Track } from '../../../types';

import spectrum from '../../helpers/spectrum';
import Speaker from './Speaker';
import TrackPositionSlider from './TrackPositionSlider';
import { PLAYBACK_RANGE_MAX } from './constants';
import AudioSpectrum from './AudioSpectrum';
import Audio from './Audio';

interface PlayerContainerProps {
  fullScreen: boolean
}
const PlayerContainer = styled.div<PlayerContainerProps>`
  width: 100%;
  height: 50px;
  background-color: #131313;
  position: fixed;
  bottom: 0;
  z-index: 99;


  ${({ fullScreen }) => (fullScreen ? `
    top: 0;
    height: 100%;

    > canvas {
      position: fixed;

      animation-name: grow;
      animation-duration: 1s;
      animation-fill-mode: forwards;
  
      @keyframes grow {
        from {
          height: 50px;
        }
  
        to {
          height: 101vh;
          transform: scale(1, -1);
        }
      }
    }

    > div {
      flex-direction: column;
      justify-content: flex-end;

      > img {
        height: 15rem;
        width: auto;
        margin-right: 0px;
      }
      > div:first-of-type {
        margin-bottom: 25vh;
        margin-top: 5vh;
      }

      > div {
        width: 100%;
        text-align: center;
        margin-right: 0px;
        background-color: transparent;
      }
    }
  
  ` : '')}
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-evenly;
  margin-left: 20px;
  margin-right: 20px;
`;

const DescriptionContainer = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 33%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
`;

const Cover = styled.img`
  max-height: 75%;
  margin-right: 10px;
  box-shadow: 0 0 5px 0px white;
`;

const PlayControls = styled.img`
  width: 15px;
  height: 15px;
  filter: invert(1);
  margin-right: 10px;
  cursor: pointer;
`;

const Controls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

interface PlayerInterface {
  playlist: Track[]
  onPlaybackTrack: (id: string) => void
}

function Player({ playlist = [], onPlaybackTrack }: PlayerInterface) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState([]);

  useEffect(() => {
    if (!playlist.length) {
      return;
    }
    setActivePlaylist(playlist);
    setCurrentTrackId(playlist[0].id);
  }, [playlist]);

  const [stream, setStream] = useState(null);

  const [track, setTrack] = useState('');
  const [artist, setArtist] = useState('');
  const [artistId, setArtistId] = useState('');

  const [cover, setCover] = useState('');

  const [RangeValue, setRangeValue] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  const getNextTrackId = useCallback(() => {
    const index = activePlaylist.findIndex((e) => e.id === currentTrackId);

    const nextTrackId = activePlaylist[index + 1]
      ? activePlaylist[index + 1].id
      : activePlaylist[0].id;

    return nextTrackId;
  }, [activePlaylist, currentTrackId]);

  const loadTrackInformation = useCallback(async (trackId) => {
    // Only here to check, if the stream is actually reachable
    axios.get(`${localStorage.getItem('host')}/v1/tracks/${currentTrackId}/stream?app_name=SPICEY`)
      .catch(() => {
        // If not, load the next track
        setCurrentTrackId(getNextTrackId());
      });

    try {
      const res = await axios.get(`${localStorage.getItem('host')}/v1/tracks/${trackId}?app_name=SPICEY`);

      const { data } = res.data;
      setTrack(data.title);
      setArtist(data.user.name);
      setArtistId(data.user.id);
      setCover(data.artwork['150x150']);
    } catch (err) {
      setCurrentTrackId(getNextTrackId());
    }
  }, [currentTrackId, getNextTrackId]);

  const handleArtistClick = useCallback(() => {
    navigate(`/artist/${artistId}`);
  }, [artistId, navigate]);

  useEffect(() => {
    if (!currentTrackId) {
      return;
    }
    loadTrackInformation(currentTrackId);
    setStream(`${localStorage.getItem('host')}/v1/tracks/${currentTrackId}/stream?app_name=SPICEY`);
  }, [currentTrackId, loadTrackInformation]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const onTimeUpdate = () => {
      const duration = !Number.isNaN(audioRef.current.duration) ? audioRef.current.duration : 0;
      const currentTime = !Number.isNaN(audioRef.current.currentTime)
        ? audioRef.current.currentTime
        : 0;

      const newRangeValue = Math.round((PLAYBACK_RANGE_MAX / duration) * currentTime);
      setRangeValue(!Number.isNaN(newRangeValue) ? newRangeValue : 0);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onCanPlay = () => {
      onPlaybackTrack(currentTrackId);
      audioRef.current.play();
    };

    const onEnded = () => {
      setCurrentTrackId(getNextTrackId());
    };

    const onKeyDown = (e) => {
      if (e.keyCode === 32 || e.code === 'Space') {
        // We don't wanna interupt a input field
        if (e.target.nodeName === 'INPUT') {
          return;
        }
        e.preventDefault();
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    };

    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    audioRef.current.addEventListener('play', onPlay);
    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('canplay', onCanPlay);
    audioRef.current.addEventListener('ended', onEnded);

    window.addEventListener('keydown', onKeyDown);

    return () => {
      if (!audioRef.current) {
        return;
      }
      audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
      audioRef.current.removeEventListener('play', onPlay);
      audioRef.current.removeEventListener('pause', onPause);
      audioRef.current.removeEventListener('canplay', onCanPlay);
      audioRef.current.removeEventListener('ended', onEnded);

      window.removeEventListener('keydown', onKeyDown);
    };
  }, [currentTrackId, getNextTrackId, onPlaybackTrack]);

  useEffect(() => {
    if (!audioRef.current || !stream) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.load();

    spectrum.start({
      canvasRef,
      audioRef,
    });
  }, [stream]);

  const handleTogglePlay = useCallback(() => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      return;
    }
    audioRef.current.pause();
  }, []);

  const handleTrackClick = useCallback(() => {
    navigate(`/track/${currentTrackId}`);
  }, [currentTrackId, navigate]);

  if (!currentTrackId) {
    return;
  }

  const isOnTrackPage = location.pathname.includes('/track/');

  return (
    <>
      <Audio stream={stream} audioRef={audioRef} />
      <PlayerContainer fullScreen={isOnTrackPage}>
        <AudioSpectrum canvasRef={canvasRef} />
        <ContentContainer>
          <Cover src={cover} />
          <DescriptionContainer>
            <TrackName onClick={handleTrackClick}>{track}</TrackName>
            <Artist onClick={handleArtistClick}>{artist}</Artist>
          </DescriptionContainer>
          <Controls>
            <PlayControls src={isPlaying ? pauseSvg : playSvg} onClick={handleTogglePlay} />
            <TrackPositionSlider audioRef={audioRef} position={RangeValue} />
            <Speaker audioRef={audioRef} />
          </Controls>
        </ContentContainer>
      </PlayerContainer>
    </>
  );
}

export default Player;
