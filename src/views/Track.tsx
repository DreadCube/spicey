import React from 'react';
import styled from 'styled-components';
import Vinyl from '../components/Vinyl';

const Floor = styled.div`
height: 600px;
width: 800px;
background: 
  conic-gradient(rgba(200,20,10,.4) 90deg,rgba(200,100,200,.3) 90deg,rgba(200,100,200,.3) 180deg,rgba(200,20,10,.4) 180deg,rgba(200,20,10,.4) 270deg,rgba(200,100,200,.3) 270deg) center center / 5em 5em,
  radial-gradient(white,#000 27%) center / 200% 200%;
transform: rotateX(.25turn);
position: absolute;
}
`;

const Plate = styled.div`
  width: 400px;
  height: 400px;
  background-color: grey;
  position: absolute;
  transform: rotateX(90deg);
`;

function VinylPlayer() {
  return (
    <Plate />
  );
}

const Box = styled.div`
  position: relative;
  z-index: 9;
  transform-style: preserve-3d;

  ${({ width }) => `
  
  > * {
    position: absolute;
  }
  > .top {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: translateY(-${width.x}px) rotateX(90deg);
  }

  > .bottom {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: rotateX(90deg);
  }

  > .back {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: translate3d(0px, -${width.x / 2}px, -${width.y / 2}px);
  }

  > .left {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: translate3d(-${width.x / 2}px, -${width.y / 2}px, 0px) rotateY(90deg);
  }

  > .right {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: translate3d(${width.x / 2}px, -${width.y / 2}px, 0px) rotateY(90deg);
  }

  > .front {
    width: ${width.x}px;
    height: ${width.y}px;
    background-color: #7a00ffba;
    transform: translate3d(0px, -${width.x / 2}px, ${width.y / 2}px);
  }
  
  
  `}

`;

function Box3D() {
  return (
    <Box width={{ x: 100, y: 100, z: 100 }}>
      <div className="top" />
      <div className="bottom" />
      <div className="front" />
      <div className="back" />
      <div className="left" />
      <div className="right" />
    </Box>
  );
}

function Track() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: 'grey',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transformStyle: 'preserve-3d',
      perspective: 400,
      perspectiveOrigin: '50% calc(25% - 5rem)',
      overflow: 'hidden',
    }}
    >
      <Floor />
      <Box3D />
      <VinylPlayer />
      <Vinyl cover="https://creatornode3.audius.co/ipfs/QmUphSqSVsNqxwHY4mzHBwjrd69YKq9Smbviie7CA1zem6/150x150.jpg" />
    </div>
  );
}

export default Track;
