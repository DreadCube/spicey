import React, { useEffect } from 'react';

import styled from 'styled-components';

const ArtistOverlayWrapper = styled.div`
  display: flex;
  overflow: hidden;

  position: fixed;
  z-index: 100;
  margin-top: -100px;


  display: ${({ active }) => (active ? 'flex' : 'none')};
`;

const ArtistOverlayArtist = styled.div`
  width: 50vw;
  height: 100vh;

  background-color: black;

  box-shadow: 0 0 10px 0px #00ffff;

  display: flex;
  align-items: center;
  justify-content: center;
  
  transform: skew(330deg, 0deg);
  overflow: hidden;

  animation-name: fadeIn;
  animation-duration: 5s;
  animation-timing-function: ease-out;
  
  animation-delay: 0s;
  animation-fill-mode: both;

  @keyframes fadeIn {
    0% {
      transform: skew(330deg, 0deg) translate(50vw, -100vh);
    }


    10% {
      transform: skew(330deg, 0deg) translate(0vw, 0vh);
    }

    15% {
      transform: skew(330deg, 0deg) translate(-2.5vw, 5vh);
    }

    20%, 95% {
      transform: skew(330deg, 0deg) translate(0vw, 0vh);
    }

  

    100% {
      transform: skew(330deg, 0deg) translate(-50vw, 100vh);
      display: none;
    }
  }
`;

const ArtistOverlayArtistImage = styled.img`
  transform: skew(30deg, 0deg);
  height: 90%;
  border-radius: 100%;
`;

const ArtistOverlayDescription = styled.div`
  width: 50vw;
  height: 100vh;
  background-color: black;
  transform: skew(330deg, 0deg);
  margin-left: 1rem;

  animation-name: fadeIn2;
  animation-duration: 5s;
  animation-timing-function: ease-out;

  animation-delay: 0s;
  animation-fill-mode: both;

  @keyframes fadeIn2 {


    
    0% {
      transform: skew(330deg, 0deg) translate(-50vw, 100vh);
    }

    10% {
      transform: skew(330deg, 0deg) translate(0vw, 0vh);
    }

    15% {
      transform: skew(330deg, 0deg) translate(2.5vw, -5vh);
    }

    20%, 95% {
      transform: skew(330deg, 0deg) translate(0vw, 0vh);
    }

    100% {
      transform: skew(330deg, 0deg) translate(50vw, -100vh);
    }
  }
`;

function ArtistOverlay({ artist }) {
  const [isActive, setIsActive] = React.useState(false);

  useEffect(() => {
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
    }, 5000);
  }, [artist]);

  return (
    <ArtistOverlayWrapper active={isActive}>
      <ArtistOverlayArtist>
        <ArtistOverlayArtistImage
          src={artist.profilePictureSrc}
        />
      </ArtistOverlayArtist>
      <ArtistOverlayDescription>
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
      </ArtistOverlayDescription>
    </ArtistOverlayWrapper>
  );
}

export default ArtistOverlay;
