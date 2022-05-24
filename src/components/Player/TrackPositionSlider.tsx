import React, { useCallback } from 'react';
import { PLAYBACK_RANGE_MAX } from './constants';

import StyledRange from './StyledRange';

interface TrackPositionSliderProps {
    audioRef: {
        current: HTMLAudioElement
    }
    position: number
}

function TrackPositionSlider({ audioRef, position }: TrackPositionSliderProps) {
  const handleChange = useCallback((e) => {
    const { duration } = audioRef.current;

    // eslint-disable-next-line no-param-reassign
    audioRef.current.currentTime = (duration / PLAYBACK_RANGE_MAX) * e.target.value;

    audioRef.current.play();
  }, [audioRef]);

  return (
    <StyledRange
      type="range"
      value={position}
      onChange={handleChange}
      max={PLAYBACK_RANGE_MAX}
    />
  );
}

export default TrackPositionSlider;
