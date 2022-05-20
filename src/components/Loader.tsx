import React from 'react';

import styled from 'styled-components';

import Logo from './Logo';

const StyledSpinner = styled.svg`
    animation: rotate 2s linear infinite;
    width: 25px;
    height: 25px;

    margin-top: 25px;
    
    & .path {
      stroke: #00ffff;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
    
    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  `;

function Spinner() {
  return (
    <StyledSpinner viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
    </StyledSpinner>
  );
}

function Loader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      zIndex: 100,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
    >
      <Logo />
      <Spinner />
    </div>
  );
}

export default Loader;
