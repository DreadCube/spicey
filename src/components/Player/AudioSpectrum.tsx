import React from 'react';

import styled from 'styled-components';

interface StyledCanvasProps {
  ref: Ref<HTMLCanvasElement>
}
const StyledCanvas = styled.canvas<StyledCanvasProps>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 50px;
  z-index: -1;
`;

interface AudioSpectrumProps {
  canvasRef: React.LegacyRef<HTMLCanvasElement>
}
function AudioSpectrum({ canvasRef }: AudioSpectrumProps) {
  return (
    <StyledCanvas
      ref={canvasRef}
    />
  );
}

export default AudioSpectrum;
