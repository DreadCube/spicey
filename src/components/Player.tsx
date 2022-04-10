import React from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

import { Artist, Track } from './AudioCard'

import speakerSvg from '../svgs/speaker.svg'
import { BASE_URL } from '../config'

let context
let analyser
let src

const Player = ({trackId, tracks = []}) => {
    const navigate = useNavigate()

    const [stream, setStream] = React.useState(null)
    
    const [track, setTrack] = React.useState('')
    const [artist, setArtist] = React.useState('')
    const [artistId, setArtistId] = React.useState('')

    const [cover, setCover]  = React.useState('')
  
    const [RangeValue, setRangeValue] = React.useState(0)
  
  
    const [volume, setVolume] = React.useState(1)
    const [showVolume, setShowVolume] = React.useState(false)
  
    const audioRef = React.useRef<HTMLAudioElement>()
    const canvasRef = React.useRef<HTMLCanvasElement>()
  
    const loadTrackInformation = async trackId => {
      const res = await axios.get(`${BASE_URL}/v1/tracks/${trackId}?app_name=SPICEY`)
  
      const data = res.data.data
      setTrack(data.title)
      setArtist(data.user.name)
      setArtistId(data.user.id)
      setCover(data.artwork['150x150'])
    }
  
    const handleRangeChange = (e) => {
      const duration = audioRef.current.duration
  
      audioRef.current.currentTime = (duration / 100) * e.target.value
      audioRef.current.play()
    }
  
    const handleVolumeChange = e => {
      const newVolume = e.target.value
      setVolume(newVolume)
      audioRef.current.volume = newVolume
    }
  
    const handleShowVolume = () => {
      setShowVolume(prev => !prev)
    }

    const handleArtistClick = React.useCallback(() => {
      navigate(`/artist/${artistId}`)
    }, [artistId])
  
    React.useEffect(() => {
      if (!trackId) {
        return
      }
      loadTrackInformation(trackId)
      setStream(`${BASE_URL}/v1/tracks/${trackId}/stream?app_name=SPICEY`)
      
      if (!audioRef.current) {
        return
      }
      audioRef.current.pause()
      audioRef.current.load()
      audioRef.current.play()
  
  
      audioRef.current.addEventListener('timeupdate', () => {
        const duration = !isNaN(audioRef.current.duration) ? audioRef.current.duration : 0
        const currentTime = !isNaN(audioRef.current.currentTime) ? audioRef.current.currentTime : 0
  
        const newRangeValue = Math.round((100 / duration) * currentTime)
        setRangeValue(!isNaN(newRangeValue) ? newRangeValue : 0)
  
      })

    }, [trackId])



    React.useEffect(() => {
      if (!audioRef.current || !canvasRef.current || !trackId) {
        return
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

      var canvas = canvasRef.current
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var ctx = canvas.getContext("2d");

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 512

      var bufferLength = analyser.frequencyBinCount;
  
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var barWidth = (WIDTH / bufferLength) * 1.5;
      var barHeight;
      var x = 0;

      function renderFrame() {
        requestAnimationFrame(renderFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        ctx.fillStyle = "rgba(19, 19, 19, 1)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
        for (var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          
          var r = barHeight + (25 * (i/bufferLength));
          var g = 250 * (i/bufferLength);
          var b = 50;
  
          //ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillStyle = "#00ffff";
          //ctx.fillStyle = "#000000";
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        }
      }
      renderFrame();
    }, [trackId])
  

    const handleVolumeBlur = React.useCallback(() => {
      setShowVolume(false)
    }, [])

  
    if (!trackId) {
      return null
    }

  
    return (
      <PlayerContainer>
        <canvas ref={canvasRef} style={{position: 'fixed', bottom: 0, left: 0, width: '100vw', height: 50, zIndex: -1}} />
        <ContentContainer>
          <Cover src={cover} />
          <DescriptionContainer>
            <Track>{track}</Track>
            <Artist onClick={handleArtistClick}>{artist}</Artist>
          </DescriptionContainer>
            <Range type="range" value={RangeValue} onChange={handleRangeChange} />
            <SpeakerContainer>
              <VolumeRange onBlur={handleVolumeBlur} showVolume={showVolume} type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} />
              <Speaker src={speakerSvg} onClick={handleShowVolume} />
            </SpeakerContainer>
        </ContentContainer>
  
        <audio crossOrigin="anonymous" style={{display: 'none'}} ref={audioRef}>
          <source src={stream} type="audio/ogg" />
          <source src={stream} type="audio/mp3" />
          <source src={stream} type="audio/mpeg" />
        </audio>
      </PlayerContainer>
    )
  }

export default Player


const PlayerContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #131313;
  position: fixed;
  bottom: 0
`

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-evenly;
  margin-left: 20px;
  margin-right: 20px;
`

const DescriptionContainer = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 33%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
`

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
`

const SpeakerContainer = styled.div`
  position: relative;
`

const Speaker = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 20px;
  filter: invert(1);
  margin-top: 5px;
`

const VolumeRange = styled(Range)`
  transform: rotate(270deg);
  position: absolute;
  bottom: 65px;
  right: -45px;
  background-color: #131313;
  width: 100px;
  padding: 5px;
  opacity: ${({showVolume}) => showVolume ? '1' : '0'};
`

const Cover = styled.img`
  max-height: 75%;
  margin-right: 10px;
  box-shadow: 0 0 5px 0px white;
`