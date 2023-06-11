import React, { useState, useCallback } from 'react';

import styled from 'styled-components';

import { Howler } from 'howler';
import StyledRange from './StyledRange';

import speakerSvg from '../../svgs/speaker.svg';

const SpeakerContainer = styled.div`
  position: relative;
`;

interface VolumeRangeProps {
  showVolume: boolean
}
const VolumeRange = styled(StyledRange)<VolumeRangeProps>`
  transform: rotate(270deg);
  position: absolute;
  bottom: 65px;
  right: -45px;
  background-color: #131313;
  width: 100px;
  padding: 5px;
  opacity: ${({ showVolume }) => (showVolume ? '1' : '0')};
  touch-action: none;
`;

const StyledSpeaker = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 20px;
  filter: invert(1);
  margin-top: 5px;
`;

function Speaker() {
  const [volume, setVolume] = useState(Howler.volume());
  const [showVolume, setShowVolume] = useState(false);

  const handleShowVolume = useCallback(() => {
    setShowVolume((prev) => !prev);
  }, []);

  const handleVolumeBlur = useCallback(() => {
    setShowVolume(false);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);

    Howler.volume(newVolume);
  }, []);

  return (
    <SpeakerContainer>
      <VolumeRange
        onBlur={handleVolumeBlur}
        showVolume={showVolume}
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={volume}
        onChange={handleVolumeChange}
      />
      <StyledSpeaker src={speakerSvg} onClick={handleShowVolume} />
    </SpeakerContainer>
  );
}

export default Speaker;
