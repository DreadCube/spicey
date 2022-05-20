import React from 'react';
import styled from 'styled-components';

const StyledVinyl = styled.div`
    width: 15rem;
    height: 15rem;
    border-radius: 100%;
    background: repeating-radial-gradient(circle at center, #000000 , #242427 5%);
    position: absolute;
    transform: rotateX(90deg);

    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
   // animation-name: rotatingVinyl;

    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes rotatingVinyl {
        0% {
            transform: rotateX(0deg) rotateZ(0deg);
            box-shadow: 0px 0px 0px 0px #02e9e9;
        }
        50% {
            transform: rotateX(180deg) rotateZ(180deg);
            box-shadow: 0px 0px 20px 0px #02e9e9;
        }
        100% {
            transform: rotateX(360deg) rotateZ(360deg);
            box-shadow: 0px 0px 0px 0px #02e9e9;

        }
    }
`;

const VinylCover = styled.img`
    height: 60%;
    border-radius: 100%;
`;

function Vinyl({ cover }) {
  return (
    <StyledVinyl>
      <div style={{
        position: 'absolute',
        borderRadius: '100%',
        width: 50,
        height: 50,
        backgroundColor: '#131313',
      }}
      />
      <VinylCover src={cover} />
    </StyledVinyl>
  );
}

export default Vinyl;
