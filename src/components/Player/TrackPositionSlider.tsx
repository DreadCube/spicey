import React, { useCallback, useEffect, useState } from 'react';
import { PLAYBACK_RANGE_MAX } from './constants';

import StyledRange from './StyledRange';

interface TrackPositionSliderProps {
    audioRef: {
        current: HTMLAudioElement
    }
    position: number
    onAddMarker: (percentage: number) => void
    onDeleteMarkers: () => void
    markers: number[]
}

function TrackPositionSlider({
  audioRef, position, onAddMarker, onDeleteMarkers, markers = [],
}: TrackPositionSliderProps) {
  const handleChange = useCallback((e) => {
    const { duration } = audioRef.current;

    // eslint-disable-next-line no-param-reassign
    audioRef.current.currentTime = (duration / PLAYBACK_RANGE_MAX) * e.target.value;

    audioRef.current.play();
  }, [audioRef]);

  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === 'Enter') {
        const percentage = (100 / audioRef.current.duration) * audioRef.current.currentTime;
        onAddMarker(percentage);
        return;
      }

      if (e.key === 'Shift') {
        e.stopPropagation();

        const percentage = (100 / audioRef.current.duration) * audioRef.current.currentTime;

        const markersCopy = [...markers];
        markersCopy.sort();

        const nextMarker = markersCopy.find((marker) => marker > percentage)
          || markersCopy[0] || null;

        if (!nextMarker) {
          return;
        }

        audioRef.current.currentTime = (audioRef.current.duration / 100) * nextMarker;
        return;
      }

      if (e.key === 'Alt') {
        onDeleteMarkers();
      }
    };
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [audioRef, onAddMarker, markers, onDeleteMarkers]);

  useEffect(() => {

  }, [markers]);

  return (
    <div style={{ position: 'relative', width: '100%' }} className="joyride-controls-playback">
      <StyledRange
        type="range"
        value={position}
        onChange={handleChange}
        max={PLAYBACK_RANGE_MAX}
      />
      <div style={{
        position: 'absolute',
        zIndex: 1,
        top: '5px',
        width: '100%',
      }}
      >
        {
          markers.map((percentage) => (
            <div
              style={{
                width: '5px',
                borderRadius: '25%',
                height: '10px',
                backgroundColor: '#ff00a9',
                position: 'absolute',
                left: `${percentage}%`,
              }}
              key={`marker-${percentage}`}
            />
          ))
        }
      </div>
    </div>
  );
}

export default TrackPositionSlider;
