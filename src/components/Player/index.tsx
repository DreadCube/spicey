import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import playSvg from '../../svgs/play.svg';
import pauseSvg from '../../svgs/pause.svg';

import spectrum from '../../helpers/spectrum';
import Speaker from './Speaker';
import TrackPositionSlider from './TrackPositionSlider';
import { PLAYBACK_RANGE_MAX } from './constants';
import AudioSpectrum from './AudioSpectrum';
import Audio from './Audio';
import Text from '../Text';
import { addMarker, deleteMarkers, getMarkers } from '../../helpers/markers';

import Tooltip from './Tooltip';
import { usePlaylist } from '../../providers/PlaylistProvider';
import audius from '../../helpers/audius';

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


  animation-name: player-fade-in;
  animation-duration: 1s;
  animation-fill-mode: forwards;

  @keyframes player-fade-in {
    from {
      opacity: 0;
      transform: translateY(50px);
    }

    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }


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

const TimeText = styled.span`
  color: white;
  font-family: miles;
  font-size: 12px;
  margin-left: 10px;
  margin-right: 10px;
  min-width: 50px;

  @media only screen and (max-width: 750px) {
    display: none;
  }
`;

function Player() {
  const navigate = useNavigate();
  const location = useLocation();

  const { playingTrack, playNext, playPrevious } = usePlaylist();

  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [trackMarkers, setTrackMarkers] = useState([]);

  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:00');

  useEffect(() => {
    if (!playingTrack) {
      return;
    }
    setCurrentTrackId(playingTrack.id);
  }, [playingTrack]);

  const [stream, setStream] = useState(null);

  const [track, setTrack] = useState('');
  const [artist, setArtist] = useState('');
  const [artistId, setArtistId] = useState('');

  const [cover, setCover] = useState('');

  const [RangeValue, setRangeValue] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  const loadTrackInformation = useCallback(async (trackId) => {
    try {
      const str = await audius.streamTrack(trackId);

      setTrack(playingTrack.title);
      setArtist(playingTrack.user.name);
      setArtistId(playingTrack.user.id);
      // eslint-disable-next-line no-underscore-dangle
      setCover(playingTrack.artwork._150x150);

      return str;
    } catch (err) {
      playNext();
    }
  }, [playNext, playingTrack]);

  const handleArtistClick = useCallback(() => {
    navigate(`/artist/${artistId}`);
  }, [artistId, navigate]);

  useEffect(() => {
    if (!currentTrackId) {
      return;
    }
    loadTrackInformation(currentTrackId)
      .then((str) => {
        setStream(str);
      });
  }, [currentTrackId, loadTrackInformation]);

  const handleTogglePlay = useCallback(() => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      return;
    }
    audioRef.current.pause();
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const onTimeUpdate = () => {
      const duration = !Number.isNaN(audioRef.current.duration) ? audioRef.current.duration : 0;
      const currentTime = !Number.isNaN(audioRef.current.currentTime)
        ? audioRef.current.currentTime
        : 0;

      const sTime = new Date(currentTime * 1000).toISOString().substring(11, 19);
      setStartTime(sTime);
      const eTime = new Date(duration * 1000).toISOString().substring(11, 19);
      setEndTime(eTime);
      const newRangeValue = Math.round((PLAYBACK_RANGE_MAX / duration) * currentTime);
      setRangeValue(!Number.isNaN(newRangeValue) ? newRangeValue : 0);
    };

    const onPlay = () => {
      const artwork = Object.entries(playingTrack.artwork || {}).map(([key, value]) => ({
        src: value,
        type: 'image/jpg',
        sizes: key.replace('_', ''),
      }));

      navigator.mediaSession.metadata = new MediaMetadata({
        title: playingTrack.title,
        artist: playingTrack.user.name,
        artwork,
      });
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onCanPlay = () => {
      audioRef.current.play();
    };

    const onEnded = () => {
      playNext();
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

    navigator.mediaSession.setActionHandler('play', handleTogglePlay);
    navigator.mediaSession.setActionHandler('pause', handleTogglePlay);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', onEnded);

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
  }, [currentTrackId]);

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

  const handleTrackClick = useCallback(() => {
    navigate(`/track/${currentTrackId}`);
  }, [currentTrackId, navigate]);

  const handleAddMarker = useCallback((percentage) => {
    const markers = addMarker(percentage, currentTrackId);
    setTrackMarkers(markers);
  }, [currentTrackId]);

  const handleDeleteMarkers = useCallback(() => {
    deleteMarkers(currentTrackId);
    setTrackMarkers([]);
  }, [currentTrackId]);

  useEffect(() => {
    const markers = getMarkers(currentTrackId);
    setTrackMarkers(markers);
  }, [currentTrackId]);

  const handleJoyrideCallback = useCallback((e) => {
    if (e.lifecycle === 'complete') {
      localStorage.setItem('joyride-complete', 'true');
      const markers = getMarkers(currentTrackId);
      setTrackMarkers(markers);
    }

    if (e.lifecycle === 'tooltip' && e.step.target === '.joyride-controls-playback') {
      setTrackMarkers([20, 50, 80]);
    }
  }, [currentTrackId]);

  if (!currentTrackId) {
    return;
  }

  const isOnTrackPage = location.pathname.includes('/track/');

  return (
    <>
      <Tooltip callback={handleJoyrideCallback} />
      <Audio stream={stream} audioRef={audioRef} />
      <PlayerContainer fullScreen={isOnTrackPage}>
        <AudioSpectrum canvasRef={canvasRef} />
        <ContentContainer>
          <Cover src={cover} />
          <DescriptionContainer>
            <Text type="primary" onClick={handleTrackClick}>{track}</Text>
            <Text onClick={handleArtistClick}>{artist}</Text>
          </DescriptionContainer>
          <Controls>
            <TimeText>{startTime}</TimeText>
            <PlayControls src={isPlaying ? pauseSvg : playSvg} onClick={handleTogglePlay} />
            <TrackPositionSlider
              audioRef={audioRef}
              position={RangeValue}
              onAddMarker={handleAddMarker}
              onDeleteMarkers={handleDeleteMarkers}
              markers={trackMarkers}
            />
            <TimeText>{endTime}</TimeText>
            <Speaker audioRef={audioRef} />
          </Controls>
        </ContentContainer>
      </PlayerContainer>
    </>
  );
}

export default Player;
