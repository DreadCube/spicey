/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import audius from '../helpers/audius';
import { TracksWrapper } from '../App';
import AudioCard from '../components/AudioCard';
import { usePlaylist } from '../providers/PlaylistProvider';

function DashboardContainer() {
  const { data: tracks, isInitialLoading } = useQuery(['dashboard'], () => audius.getTrendingTracks());

  const { playingTrack, play } = usePlaylist();

  const handlePlayTrack = useCallback((trackId) => {
    play(trackId, tracks);
  }, [play, tracks]);

  return (
    <TracksWrapper>
      {!isInitialLoading && tracks.map((track, index) => (
        <AudioCard
          {...track}
          onClick={handlePlayTrack}
          key={track.id}
          isActive={playingTrack?.id === track.id}
          entryDelay={index * 50}
        />
      ))}
    </TracksWrapper>
  );
}

export default DashboardContainer;
