/* eslint-disable no-underscore-dangle */
import React from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

import isVerifiedSvg from '../svgs/verified.svg';
import { Track } from '../helpers/audius/types';

import Text from './Text';
import { Spinner } from './Loader';

interface CardProps {
  isActive: boolean
  entryDelay: number
}

const Card = styled.div<CardProps>`
  display: block;
  background-color: #131313;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 0px 1px cyan;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  ${({ isActive }) => (isActive
    ? `box-shadow: 0px 0px 10px 1px #ff00a9;
    .playButton {
      opacity: 1;
    }
    ` : '')}


  opacity: 0;

  @keyframes audioCard-fadeIn {
    0% {
      opacity: 0;
      transform: translateY(250px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  animation: audioCard-fadeIn 1s;
  animation-delay: ${({ entryDelay }) => entryDelay}ms;
  animation-fill-mode: forwards;
`;

interface CoverProps {
  src: string
}
const Cover = styled.div<CoverProps>`
  border-radius: 10px;
  box-shadow: 0px 0px 10px #000000;
  max-width: 150px;
  background-image: url("${({ src }) => src}");
  width: 150px;
  height: 150px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: flex-end;
  width: 100%;
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

const Verified = styled.img`
  margin-left: 5px;
  filter: invert(1);
  width: 10px;
  height: 10px;
  vertical-align: bottom;
`;

interface AudioCardInterface extends Track {
  isActive: boolean
  onClick: (id: string) => void
  entryDelay?: number
}

const SpinnerWrapper = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AudioCard({
  artwork, title, user, id, onClick, isActive,
  entryDelay = 0,
}: AudioCardInterface) {
  const navigate = useNavigate();

  const artworkSrc = artwork._150x150 || '';

  const coverRef = React.useRef<HTMLImageElement>();
  const [coverLoaded, setCoverLoaded] = React.useState(false);

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  const handleArtistClick = React.useCallback(() => {
    navigate(`/artist/${user.id}`);
  }, [user.id, navigate]);

  const handleTrackClick = React.useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  React.useEffect(() => {
    setCoverLoaded(false);

    coverRef.current = new Image();
    coverRef.current.src = artworkSrc;

    const handleCoverLoaded = () => {
      setCoverLoaded(true);
    };

    coverRef.current.addEventListener('load', handleCoverLoaded);

    return () => {
      coverRef.current.removeEventListener('load', handleCoverLoaded);
    };
  }, [artworkSrc]);

  const cardRef = React.useRef();

  React.useEffect(() => {
    if (!isActive) {
      cardRef.current.style.boxShadow = '0px 0px 0px 1px cyan';
      return;
    }

    const applyBoxShadow = ({ data }) => {
      const boxShadow = data.reduce((acc, curr) => acc + curr, 0) / data.length / 2;

      cardRef.current.style.boxShadow = `0px 0px ${boxShadow}px 1px #ff00a9`;
    };

    window.addEventListener('message', applyBoxShadow);

    return () => {
      window.removeEventListener('message', applyBoxShadow);
    };
  }, [isActive]);

  return (
    <Card isActive={isActive} entryDelay={entryDelay} ref={cardRef}>
      {
        coverLoaded
          ? (
            <CoverWrapper onClick={handleClick}>
              <Cover src={artworkSrc} />
              <PlayButton className="playButton" src="https://www.svgrepo.com/show/13672/play-button.svg" />
            </CoverWrapper>
          )
          : (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          )
      }
      <TextWrapper>
        <Text type={isActive ? 'secondary' : 'primary'} onClick={handleTrackClick}>{title}</Text>
        <Text onClick={handleArtistClick}>
          {user.name}
          {user.is_verified && <Verified src={isVerifiedSvg} />}
        </Text>
      </TextWrapper>
    </Card>
  );
}

export default AudioCard;
