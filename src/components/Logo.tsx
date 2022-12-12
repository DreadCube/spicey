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

  @keyframes easteregg {
    0% {
      opacity: 1;
      width: 40px;
    }
    50% {
      opacity: 0.5;
      width: 40px;
    }
    100% {
      opacity: 0;
      width: 0px;
    }
  }


  &:hover {
    animation-name: easteregg;
    animation-duration: 1s;
    animation-fill-mode: forwards;
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
