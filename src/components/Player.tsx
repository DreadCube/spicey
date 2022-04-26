import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Artist, TrackName } from './AudioCard';

import speakerSvg from '../svgs/speaker.svg';
import playSvg from '../svgs/play.svg';
import pauseSvg from '../svgs/pause.svg';

import { BASE_URL } from '../config';
import { Track } from '../types';

let context;
let analyser;
let src;

const PlayerContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #131313;
  position: fixed;
  bottom: 0;
  z-index: 99;
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

const Range = styled.input`
  width: 100%;
  height: 24px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background: inherit;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #00FFFF;
    background: #000000;
    border-radius: 50px;
    border: 0px solid #00FFFF;
  }


  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
  }


  &:focus::-webkit-slider-runnable-track {
    background: #000000;
  }

  &::-moz-range-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #00FFFF;
    background: #000000;
    border-radius: 50px;
    border: 0px solid #00FFFF;
  }

  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
  }

  &::-ms-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-ms-fill-lower {
    background: #000000;
    border: 0px solid #00FFFF;
    border-radius: 100px;
    box-shadow: 0px 0px 0px #00FFFF;
  }

  &::-ms-fill-upper {
    background: #000000;
    border: 0px solid #00FFFF;
    border-radius: 100px;
    box-shadow: 0px 0px 0px #00FFFF;
  }

  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 15px;
    width: 15px;
    border-radius: 23px;
    background: #00FFFF;
    cursor: pointer;
  }

  &:focus::-ms-fill-lower {
    background: #000000;
  }

  &:focus::-ms-fill-upper {
    background: #000000;
  }
`;

const SpeakerContainer = styled.div`
  position: relative;
`;

const Speaker = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 20px;
  filter: invert(1);
  margin-top: 5px;
`;

interface VolumeRangeProps {
  showVolume: boolean
}
const VolumeRange = styled(Range)<VolumeRangeProps>`
  transform: rotate(270deg);
  position: absolute;
  bottom: 65px;
  right: -45px;
  background-color: #131313;
  width: 100px;
  padding: 5px;
  opacity: ${({ showVolume }) => (showVolume ? '1' : '0')};
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

interface PlayerInterface {
  playlist: Track[]
  onPlaybackTrack: (id: string) => void
}

const PLAYBACK_RANGE_MAX = 10000;

function Player({ playlist = [], onPlaybackTrack }: PlayerInterface) {
  const navigate = useNavigate();

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

  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);

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
    axios.get(`${BASE_URL}/v1/tracks/${currentTrackId}/stream?app_name=SPICEY`)
      .catch(() => {
        // If not, load the next track
        setCurrentTrackId(getNextTrackId());
      });

    try {
      const res = await axios.get(`${BASE_URL}/v1/tracks/${trackId}?app_name=SPICEY`);

      const { data } = res.data;
      setTrack(data.title);
      setArtist(data.user.name);
      setArtistId(data.user.id);
      setCover(data.artwork['150x150']);
    } catch (err) {
      setCurrentTrackId(getNextTrackId());
    }
  }, [currentTrackId, getNextTrackId]);

  const handleRangeChange = (e) => {
    const { duration } = audioRef.current;

    audioRef.current.currentTime = (duration / PLAYBACK_RANGE_MAX) * e.target.value;

    audioRef.current.play();
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleShowVolume = () => {
    setShowVolume((prev) => !prev);
  };

  const handleArtistClick = useCallback(() => {
    navigate(`/artist/${artistId}`);
  }, [artistId, navigate]);

  useEffect(() => {
    if (!currentTrackId) {
      return;
    }
    loadTrackInformation(currentTrackId);
    setStream(`${BASE_URL}/v1/tracks/${currentTrackId}/stream?app_name=SPICEY`);
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
  }, [stream]);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current || !currentTrackId) {
      return;
    }

    if (!context) {
      context = new AudioContext();
    }
    if (!analyser) {
      analyser = context.createAnalyser();
    }

    if (!src) {
      src = context.createMediaElementSource(audioRef.current);
    }

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const barWidth = (WIDTH / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(19, 19, 19, 1)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillStyle = '#00ffff';
        // ctx.fillStyle = "#000000";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
    renderFrame();
  }, [currentTrackId]);

  const handleVolumeBlur = useCallback(() => {
    setShowVolume(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      return;
    }
    audioRef.current.pause();
  }, []);

  return (
    <>
      <audio crossOrigin="anonymous" style={{ display: 'none' }} ref={audioRef}>
        <source src={stream} type="audio/ogg" />
        <source src={stream} type="audio/mp3" />
        <source src={stream} type="audio/mpeg" />
      </audio>
      {
      currentTrackId
      && (
      <PlayerContainer>
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed', bottom: 0, left: 0, width: '100vw', height: 50, zIndex: -1,
          }}
        />
        <ContentContainer>
          <Cover src={cover} />
          <DescriptionContainer>
            <TrackName>{track}</TrackName>
            <Artist onClick={handleArtistClick}>{artist}</Artist>
          </DescriptionContainer>
          <PlayControls src={isPlaying ? pauseSvg : playSvg} onClick={handleTogglePlay} />
          <Range type="range" value={RangeValue} onChange={handleRangeChange} max={PLAYBACK_RANGE_MAX} />
          <SpeakerContainer>
            <VolumeRange onBlur={handleVolumeBlur} showVolume={showVolume} type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} />
            <Speaker src={speakerSvg} onClick={handleShowVolume} />
          </SpeakerContainer>
        </ContentContainer>
      </PlayerContainer>
      )
    }
    </>
  );
}

export default Player;
