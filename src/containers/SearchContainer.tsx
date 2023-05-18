/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import audius from '../helpers/audius';
import { TracksWrapper } from '../App';
import AudioCard from '../components/AudioCard';
import { usePlaylist } from '../providers/PlaylistProvider';

function SearchContainer() {
  const { search } = useParams();

  const { data: tracks, isInitialLoading } = useQuery(['search', search], () => audius.searchTracks({
    query: search,
  }));

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
          id={track.id}
          artwork={track.artwork}
          title={track.title}
          user={track.user}
          isActive={playingTrack?.id === track.id}
          entryDelay={index * 50}
        />
      ))}
    </TracksWrapper>
  );
}

export default SearchContainer;
