import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Howl, Howler } from 'howler';
import playSvg from '../../svgs/play.svg';
import pauseSvg from '../../svgs/pause.svg';

import spectrum from '../../helpers/spectrum';
import Speaker from './Speaker';
import TrackPositionSlider from './TrackPositionSlider';
import { PLAYBACK_RANGE_MAX } from './constants';
import AudioSpectrum from './AudioSpectrum';
import Text from '../Text';
import { addMarker, deleteMarkers, getMarkers } from '../../helpers/markers';

import Tooltip from './Tooltip';
import { usePlaylist } from '../../providers/PlaylistProvider';
import audius from '../../helpers/audius';

Howler.autoUnlock = true;
Howler.usingWebAudio = true;
Howler.html5PoolSize = 100;

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

  const canvasRef = useRef<HTMLCanvasElement>();

  const howlerRef = useRef<Howl>();

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

  useEffect(() => {
    if (!currentTrackId) {
      return;
    }
    loadTrackInformation(currentTrackId)
      .then((str) => {
        setStream(str);
      });
  }, [currentTrackId, loadTrackInformation]);

  const onPlay = useCallback(() => {
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

    const audio = howlerRef.current?._sounds[0]?._node;
    spectrum.start(
      { canvasRef, audio },
    );

    setIsPlaying(true);
  }, [playingTrack]);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onEnded = useCallback(() => {
    playNext();
  }, [playNext]);

  const onTimeUpdate = useCallback((currentTime: number, duration: number) => {
    const sTime = new Date(currentTime * 1000).toISOString().substring(11, 19);
    setStartTime(sTime);
    const eTime = new Date(duration * 1000).toISOString().substring(11, 19);
    setEndTime(eTime);
    const newRangeValue = Math.round((PLAYBACK_RANGE_MAX / duration) * currentTime);
    setRangeValue(!Number.isNaN(newRangeValue) ? newRangeValue : 0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (howlerRef.current.playing()) {
      howlerRef.current.pause();
      return;
    }
    howlerRef.current.play();
  }, []);

  const onKeyDown = useCallback((e) => {
    if (e.keyCode === 32 || e.code === 'Space') {
      // We don't wanna interupt a input field
      if (e.target.nodeName === 'INPUT') {
        return;
      }
      e.preventDefault();
      handleTogglePlay();
    }
  }, [handleTogglePlay]);

  useEffect(() => {
    howlerRef.current = new Howl({
      src: [stream],
      html5: true,
    });

    howlerRef.current.on('play', onPlay);
    howlerRef.current.on('pause', onPause);
    howlerRef.current.on('end', onEnded);

    const interval = setInterval(() => {
      const currentTime = howlerRef.current.seek();
      const duration = howlerRef.current.duration();
      onTimeUpdate(currentTime, duration);
    }, 100);

    navigator.mediaSession.setActionHandler('play', handleTogglePlay);
    navigator.mediaSession.setActionHandler('pause', handleTogglePlay);
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', onEnded);
    navigator.mediaSession.setActionHandler('stop', onPause);

    window.addEventListener('keydown', onKeyDown);

    howlerRef.current.play();

    return () => {
      spectrum.stop();
      clearInterval(interval);

      window.removeEventListener('keydown', onKeyDown);

      if (howlerRef?.current) {
        howlerRef.current.off();
        howlerRef.current.unload();
      }
    };
  }, [stream, onPlay, onPause, onEnded, onTimeUpdate, handleTogglePlay, playPrevious, onKeyDown]);

  const handleArtistClick = useCallback(() => {
    navigate(`/artist/${artistId}`);
  }, [artistId, navigate]);

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

  /*
  * Enables audio cross origin. Needed for spectrum visualizer part
  */
  const enableAudioCrossOrigin = useCallback(() => {
    const audio = howlerRef.current?._sounds[0]?._node;
    audio.crossOrigin = 'anonymous';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', enableAudioCrossOrigin);
    window.addEventListener('click', enableAudioCrossOrigin);
    window.addEventListener('touchstart', enableAudioCrossOrigin);
    window.addEventListener('touchmove', enableAudioCrossOrigin);

    return () => {
      window.removeEventListener('mousemove', enableAudioCrossOrigin);
      window.removeEventListener('click', enableAudioCrossOrigin);
      window.removeEventListener('touchstart', enableAudioCrossOrigin);
      window.removeEventListener('touchmove', enableAudioCrossOrigin);
    };
  }, [enableAudioCrossOrigin]);

  if (!currentTrackId) {
    return null;
  }

  const isOnTrackPage = location.pathname.includes('/track/');

  return (
    <>
      <Tooltip callback={handleJoyrideCallback} />
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
              howlerRef={howlerRef}
              position={RangeValue}
              onAddMarker={handleAddMarker}
              onDeleteMarkers={handleDeleteMarkers}
              markers={trackMarkers}
            />
            <TimeText>{endTime}</TimeText>
            <Speaker />
          </Controls>
        </ContentContainer>
      </PlayerContainer>
    </>
  );
}

export default Player;
