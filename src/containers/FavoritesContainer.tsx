/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Navigate, useNavigate } from 'react-router-dom';
import audius from '../helpers/audius';
import { TracksWrapper } from '../App';
import AudioCard from '../components/AudioCard';
import { usePlaylist } from '../providers/PlaylistProvider';
import { useAuth } from '../providers/AuthProvider';

function FavoritesContainer() {
  const { user } = useAuth();
  const { data: tracks = [] } = useQuery(['favorites', user?.id], () => audius.getFavoritesTracks(user?.id), { enabled: !!user?.id });

  const { playingTrack, play } = usePlaylist();

  const handlePlayTrack = useCallback((trackId) => {
    play(trackId, tracks);
  }, [play, tracks]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <TracksWrapper>
      {tracks.map((track, index) => (
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

export default FavoritesContainer;
