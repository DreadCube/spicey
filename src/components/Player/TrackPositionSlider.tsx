import { Howl } from 'howler';
import React, { useCallback, useEffect } from 'react';

import styled from 'styled-components';

import { PLAYBACK_RANGE_MAX } from './constants';

import StyledRange from './StyledRange';

const TrackPositionSliderWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const MarkersWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 5px;
  width: 100%;
`;

interface MarkerProps {
  percentage: number
}

const Marker = styled.div<MarkerProps>`
  width: 5px;
  border-radius: 25%;
  height: 10px;
  background-color: #ff00a9;
  position: absolute;
  left: ${({ percentage = 0 }) => percentage}%;
`;

interface TrackPositionSliderProps {
  howlerRef: {
    current: Howl
  }
  position: number
  onAddMarker: (percentage: number) => void
  onDeleteMarkers: () => void
  markers: number[]
}

function TrackPositionSlider({
  howlerRef, position, onAddMarker, onDeleteMarkers, markers = [],
}: TrackPositionSliderProps) {
  const handleChange = useCallback((e) => {
    const duration = howlerRef.current.duration();

    howlerRef.current.seek((duration / PLAYBACK_RANGE_MAX) * e.target.value);
  }, [howlerRef]);

  useEffect(() => {
    const onKeyUp = (e) => {
      const duration = howlerRef.current.duration();
      const currentTime = howlerRef.current.seek();
      if (e.keyCode === 49) {
        const percentage = (100 / duration) * currentTime;
        onAddMarker(percentage);
        return;
      }

      if (e.keyCode === 50) {
        e.stopPropagation();

        const percentage = (100 / duration) * currentTime;

        const markersCopy = [...markers];
        markersCopy.sort();

        const nextMarker = markersCopy.find((marker) => marker > percentage)
          || markersCopy[0] || null;

        if (!nextMarker) {
          return;
        }

        howlerRef.current.seek((duration / 100) * nextMarker);

        return;
      }

      if (e.keyCode === 51) {
        onDeleteMarkers();
      }
    };
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [howlerRef, onAddMarker, markers, onDeleteMarkers]);

  useEffect(() => {

  }, [markers]);

  return (
    <TrackPositionSliderWrapper className="joyride-controls-playback">
      <StyledRange
        type="range"
        value={position}
        onChange={handleChange}
        max={PLAYBACK_RANGE_MAX}
      />
      <MarkersWrapper>
        {
          markers.map((percentage) => (
            <Marker
              percentage={percentage}
              key={`marker-${percentage}`}
            />
          ))
        }
      </MarkersWrapper>
    </TrackPositionSliderWrapper>
  );
}

export default TrackPositionSlider;
