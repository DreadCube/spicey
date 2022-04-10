import React from 'react'

import styled from 'styled-components'

import {Routes, Route, useParams, useNavigate} from 'react-router-dom'

import Logo, {LogoAlt} from './components/Logo'
import AudioCard, { Artist, Track } from './components/AudioCard'
import SearchInput from './components/SearchInput'

import githubSvg from './svgs/github.svg'


import axios from 'axios'
import { BASE_URL } from './config'
import Player from './components/Player'

const Wrapper: React.FC = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: black;
`
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
`

const LogoWrapper = styled.div`
  margin: 10px;
`


const TracksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }

`

/*const TracksWrapper = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
`
*/

const Content = styled.div`
  margin-top: 100px;
  margin-bottom: 50px;

  @media only screen and (max-width: 600px) {
    margin-top: 150px;
  }
`

const HeaderIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
`

const useTracks = (url) => {
  const [tracks, setTracks] = React.useState([])

  const loadTracks = async (url) => {
    const res = await axios.get(url)

    const foundedTracks = res.data.data.map(track => {
      
      return {
        id: track.id,
        src: track.artwork['150x150'],
        track: track.title,
        artist: track.user.name,
        artistId: track.user.id,
      }
    })

    setTracks(foundedTracks)
  }

  React.useEffect(() => {
    loadTracks(url)
  }, [url])

  return {
    tracks
  }
}

const getTrackUrl = (search) => {
  if (search.length) {
    return `${BASE_URL}/v1/tracks/search?query=${search}&app_name=SPICEY`
  }
  return `${BASE_URL}/v1/tracks/trending?app_name=SPICEY`
} 

const App = () => {
  const [search, setSearch] = React.useState('')
  const {tracks} = useTracks(getTrackUrl(search))
  const [playingTrackId, setPlayingTrackId] = React.useState(null)

  const navigate = useNavigate()

  const onSearch = async (search) => {
    setSearch(search)
    navigate('/')
  }

  const handlePlayTrack = React.useCallback((trackId) => {
    setPlayingTrackId(trackId)
  }, [])

  return (
    <Wrapper>
      <Header>
        <LogoWrapper>
          <LogoAlt />
        </LogoWrapper>
        <SearchInput onSearch={onSearch} />
      </Header>

      <Content playerOpen={!!playingTrackId}>
        <Routes>
          <Route path="/" element={<Dashboard tracks={tracks} handlePlayTrack={handlePlayTrack} />} />
          <Route path="/artist/:artistId" element={<UserPage handlePlayTrack={handlePlayTrack} />} />
        </Routes>
      </Content>
      <Player trackId={playingTrackId} tracks={tracks} />
    </Wrapper>
  )
}

const Dashboard = ({tracks, handlePlayTrack}) => {
  return (
    <TracksWrapper>
      {tracks.map(track => (
        <AudioCard 
          onClick={handlePlayTrack} 
          key={track.id} 
          id={track.id} 
          src={track.src} 
          track={track.track} 
          artist={track.artist}
          artistId={track.artistId}
          />
      ))}
    </TracksWrapper>
  )
}

const Cover = styled.div`
  background-image: url("${({src}) => src}");

  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  width: 100%;
  height: 100%;

  min-height: calc(100vh - 150px);
`

const UserPage = ({handlePlayTrack}) => {
  const {artistId} = useParams()

  const [cover, setCover] = React.useState('')

  const {tracks} = useTracks(`${BASE_URL}/v1/users/${artistId}/tracks?app_name=SPICEY`)

  const loadArtist = async artistId => {
    const res = await axios.get(`${BASE_URL}/v1/users/${artistId}?app_name=SPICEY`)    
    setCover(res.data.data.cover_photo['2000x'])
  }

  React.useEffect(() => {
    loadArtist(artistId)
  }, [artistId])

  return (
    <Cover src={cover}>
      <TracksWrapper>
        {tracks.map(track => (
          <AudioCard 
            onClick={handlePlayTrack} 
            key={track.id} 
            id={track.id} 
            src={track.src} 
            track={track.track} 
            artist={track.artist}
            artistId={track.artistId}
          />
        ))}
      </TracksWrapper>
    </Cover>
  ) 
}



export default App