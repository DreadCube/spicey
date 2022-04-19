import React from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import placeholderImg from '../icons/apple-touch-icon-180x180.png';

interface CardProps {
  isActive: boolean
}
const Card = styled.div<CardProps>`
  background-color: #131313;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 0px 1px cyan;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  ${({ isActive }) => (isActive
    ? `box-shadow: 0px 0px 10px 1px cyan;
    .playButton {
      opacity: 1;
    }
    ` : '')}

`;

const Cover = styled.img`
  border-radius: 10px;
  box-shadow: 0px 0px 10px #000000;
  max-width: 150px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: flex-end;
  width: 100%;
`;

export const Track = styled.span`
  font-family: corma;
  color: #00ffff;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Artist = styled.span`
  font-family: miles;
  text-transform: uppercase;
  color: white;
  line-height: 1;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    cursor: pointer;
  }
`;

const CoverWrapper = styled.div`
  width: inherit;
  position: relative;
  cursor: pointer;

  &:hover .playButton {
    opacity: 1;
  }
`;

const PlayButton = styled.img`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 50px;
  height: 50px;
  filter: invert(1);
  opacity: 0.2;
`;

interface AudioCardProps {
  src: string
  track: string
  artist: string
  id: string
  onClick: (id: string) => void
  artistId: string
  isActive: boolean
}

function AudioCard({
  src, track, artist, id, onClick, artistId, isActive,
}: AudioCardProps) {
  const navigate = useNavigate();

  const coverRef = React.useRef<HTMLImageElement>();
  const [coverLoaded, setCoverLoaded] = React.useState(false);

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  const handleArtistClick = React.useCallback(() => {
    navigate(`/artist/${artistId}`);
  }, [artistId, navigate]);

  React.useEffect(() => {
    setCoverLoaded(false);

    coverRef.current = new Image();
    coverRef.current.src = src;

    const handleCoverLoaded = () => {
      setCoverLoaded(true);
    };

    coverRef.current.addEventListener('load', handleCoverLoaded);

    return () => {
      coverRef.current.removeEventListener('load', handleCoverLoaded);
    };
  }, [src]);

  return (
    <Card isActive={isActive}>
      <CoverWrapper onClick={handleClick}>
        <Cover src={!coverLoaded ? placeholderImg : src} />
        <PlayButton className="playButton" src="https://www.svgrepo.com/show/13672/play-button.svg" />
      </CoverWrapper>
      <TextWrapper>
        <Track>{track}</Track>
        <Artist onClick={handleArtistClick}>{artist}</Artist>
      </TextWrapper>
    </Card>
  );
}

export default AudioCard;
