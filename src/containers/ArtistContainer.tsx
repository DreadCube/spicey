/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import audius from '../helpers/audius';
import { TracksWrapper } from '../App';
import AudioCard from '../components/AudioCard';
import { usePlaylist } from '../providers/PlaylistProvider';
import ArtistHeader from '../components/ArtistHeader';

function ArtistContainer() {
  const { artistId } = useParams();

  const { data: artist, isInitialLoading } = useQuery(['artist', artistId], () => audius.getUser(artistId));
  const { data: tracks, isInitialLoading: isLoadingTracks } = useQuery(['artist/tracks', artistId], () => audius.getTracksByUser(artistId), { enabled: !isInitialLoading });

  const { playingTrack, play } = usePlaylist();

  const handlePlayTrack = useCallback((trackId) => {
    play(trackId, tracks);
  }, [play, tracks]);

  if (isInitialLoading) {
    return null;
  }
  return (
    <>
      <ArtistHeader artist={artist} />
      <TracksWrapper>
        {!isLoadingTracks && tracks.map((track, index) => (
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
    </>
  );
}

export default ArtistContainer;
