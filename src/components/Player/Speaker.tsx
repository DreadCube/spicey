import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';

import styled from 'styled-components';

import { Howler } from 'howler';
import { Icon } from '@iconify/react';
import StyledRange from './StyledRange';

const SpeakerContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: 10px;
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
  display: ${({ showVolume }) => (showVolume ? 'block' : 'none')};
  touch-action: none;
`;

const VolumeIcon = styled(Icon)`
  cursor: pointer;
`;

function Speaker() {
  const [volume, setVolume] = useState(Howler.volume());
  const [showVolume, setShowVolume] = useState(false);

  const mouseOver = React.useRef(false);
  const volumeRangeRef = React.useRef(undefined);

  const handleShowVolume = useCallback((e) => {
    e.stopPropagation();
    setShowVolume((prev) => !prev);

    volumeRangeRef.current.focus();
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = e.target.value;
    setVolume(+newVolume);

    Howler.volume(+newVolume);
  }, []);

  const volumeIcon = useMemo(() => getIconByVolume(volume), [volume]);

  const handleBlur = useCallback(() => {
    if (!mouseOver.current) {
      setShowVolume(false);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseOver.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseOver.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleBlur);

    return () => {
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur]);

  return (
    <SpeakerContainer
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <VolumeRange
        showVolume={showVolume}
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={volume}
        onChange={handleVolumeChange}
        ref={volumeRangeRef}
      />
      <VolumeIcon icon={volumeIcon} fontSize="24px" color="white" onClick={handleShowVolume} />
    </SpeakerContainer>
  );
}

const getIconByVolume = (volume: number) => {
  if (volume === 0) {
    return 'humbleicons:volume-off';
  }
  if (volume >= 0.5) {
    return 'humbleicons:volume-2';
  }
  return 'humbleicons:volume-1';
};

export default Speaker;
