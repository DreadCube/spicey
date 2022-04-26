import React, { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

const Title = styled.span`
  font-family: corma;
  color: #00ffff;
  font-size: 80px;
  line-height: 1;
`;

const SubTitle = styled.span`
  font-family: miles;
  text-transform: uppercase;
  color: white;
  font-size: 15px;
  line-height: 1;
  font-weight: bold;
`;

const Frame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const FrameAlt = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

const Easter = styled.div`
  display: inline-block;
  transform-origin: bottom;

  @keyframes easteregg {
    0% {
      transform: rotate(-5deg);
    }

    25% {
      transform: rotate(5deg);
    }

    50% {
      transform: translateY(0px) rotate(-20deg);
      
    }

    80% {
      transform: translateY(100vh) rotate(-90deg);
    }

    81% {
      transform: translateY(-100px) rotate(-90deg);
    }

    100% {
      translateY(-60px) rotate(-90deg);
    }
  }


  &:hover {
    animation-iteration-count: 1;
    animation-name: easteregg;
    animation-duration: 2s;
    animation-fill-mode: none;
    animation-timing-function: ease-in;
  }
`;

function Logo() {
  return (
    <Frame>
      <Title>Spicey</Title>
      <SubTitle>Audius Player</SubTitle>
    </Frame>
  );
}

function LogoAlt() {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <FrameAlt onClick={handleClick}>
      <Title>
        Spic
        <Easter>e</Easter>
        y
      </Title>
      <SubTitle>Audius Player</SubTitle>
    </FrameAlt>
  );
}

export default Logo;
export {
  LogoAlt,
};
