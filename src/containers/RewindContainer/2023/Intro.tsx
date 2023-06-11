import React, { useState } from 'react';
import styled from 'styled-components';
import CircleGradient from '../../../components/Gradient';
import Text from '../../../components/Text';

import rewind from './assets/audio/rewind.mp3';

const SpiceyText = styled(Text)`
    color: black;
    font-size: 20vw;
`;

const RewindText = styled(Text)`
    font-size: 8vw;
    color: black;
`;

const RewindYear = styled(Text)`
    font-size: 8vw;
    color: #03D8F3;
`;

const PreparingText = styled(Text)`
    font-size: 4vw;
    color: white;
    margin-top: 50px;

    animation-name: pulse;
    animation-iteration-count: infinite;
    animation-duration: 2s;
    animation-delay: 4s;

    opacity: 0;

    @keyframes pulse {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }
  
      100% {
        opacity: 0;
      }
    }
`;

const Container = styled(CircleGradient)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;

  animation-name: mainContent-fadeIn;
  animation-delay: 2s;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;

  opacity: 0;

  @keyframes mainContent-fadeIn {
    0% {
      opacity: 0;
    }

    75% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const MainTextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 1vw solid black;
  margin-top: 1.5vh;
  margin-bottom: 1.5vh;
  margin-left: 3vw;
  padding-left: 3vw;
  margin-right: 3vw;
  justify-content: center;
`;

interface IntroProps {
    nextPage: () => void
}

function Intro({ nextPage }: IntroProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    const audio = new Audio();
    audio.onended = () => {
      nextPage();
    };
    audio.src = rewind;
    audio.oncanplaythrough = () => {
      audio.play();
      setClicked(true);
    };
  };

  if (!clicked) {
    return (
      <Container key="foo" width="100%" height="100%" fromColor="black" toColor="black" onClick={handleClick} delay="0.1s">
        <MainContent>
          <PreparingText>Click to start</PreparingText>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container key="bar" width="100%" height="100%" fromColor="black" toColor="#fdf800" delay="0.5s">
      <MainContent>
        <SpiceyText type="secondary">SPICEY</SpiceyText>
        <MainTextContent>

          <RewindText type="primary">Rewind</RewindText>
          <RewindYear>2023</RewindYear>
        </MainTextContent>
      </MainContent>

    </Container>
  );
}

export default Intro;
